const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await prisma.result.findMany({
      include: {
        student: true,
        test: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching submissions' });
  }
};

exports.createTest = async (req, res) => {
  const { title, description, questions } = req.body;
  
  try {
    const test = await prisma.test.create({
      data: {
        title,
        description,
        questions: {
          create: questions.map(q => ({
            text: q.text,
            options: q.options
          }))
        }
      },
      include: {
        questions: true
      }
    });
    res.status(201).json(test);
  } catch (error) {
    console.error('Error creating test:', error);
    res.status(500).json({ error: 'Error creating test' });
  }
};

exports.addQuestionsToTest = async (req, res) => {
  const { testId } = req.params;
  const { questions } = req.body;

  try {
    // Delete existing questions for this test to overwrite them
    await prisma.question.deleteMany({
      where: { testId: parseInt(testId) }
    });

    const createdQuestions = await prisma.question.createMany({
      data: questions.map(q => ({
        testId: parseInt(testId),
        text: q.text,
        options: q.options
      }))
    });
    res.status(201).json(createdQuestions);
  } catch (error) {
    console.error('Error overwriting questions:', error);
    res.status(500).json({ error: 'Error adding questions' });
  }
};

exports.editTest = async (req, res) => {
  const { testId } = req.params;
  const { title, description } = req.body;
  try {
    const updatedTest = await prisma.test.update({
      where: { id: parseInt(testId) },
      data: { title, description }
    });
    res.json(updatedTest);
  } catch (error) {
    res.status(500).json({ error: 'Error updating test' });
  }
};

exports.deleteTest = async (req, res) => {
  const { testId } = req.params;
  try {
    // Delete related results and questions first due to foreign key constraints
    await prisma.result.deleteMany({ where: { testId: parseInt(testId) } });
    await prisma.question.deleteMany({ where: { testId: parseInt(testId) } });
    await prisma.test.delete({ where: { id: parseInt(testId) } });
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting test' });
  }
};

exports.editQuestion = async (req, res) => {
  const { questionId } = req.params;
  const { text, options } = req.body;
  try {
    const updatedQuestion = await prisma.question.update({
      where: { id: parseInt(questionId) },
      data: { text, options }
    });
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Error updating question' });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { questionId } = req.params;
  try {
    await prisma.question.delete({ where: { id: parseInt(questionId) } });
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting question' });
  }
};

exports.uploadPdfTemplate = async (req, res) => {
  const { testId } = req.params;
  
  if (!req.file) {
    return res.status(400).json({ error: 'No PDF file uploaded' });
  }

  try {
    const updatedTest = await prisma.test.update({
      where: { id: parseInt(testId) },
      data: { pdfTemplatePath: req.file.path }
    });
    res.json({ message: 'PDF template uploaded successfully', test: updatedTest });
  } catch (error) {
    console.error('Error uploading PDF template:', error);
    res.status(500).json({ error: 'Error linking PDF template to test' });
  }
};
