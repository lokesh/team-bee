import Model from '../models/model';

const messagesModel = new Model('messages');

export const listMessages = async (req, res) => {
  try {
    const data = await messagesModel.select('name, message');
    res.status(200).json({ messages: data.rows});
  } catch (err) {
    res.status(200).json({ messages:err.stack });
   }
}

export const createMessage = async (req, res) => {  
  const columns = ['name', 'message'];
  const columnsStr = columns.join(',');
  const { name, message } = req.body;
  const values = `'${name}', '${message}'`;
  try {    
    const data = await messagesModel.create(columnsStr, values);
    res.status(200).json({ messages: data.rows});
  } catch (err) {
    res.status(200).json({ messages:err.stack });
   }
}

