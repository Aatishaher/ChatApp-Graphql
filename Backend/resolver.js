const usermodel = require('./Database/user');
const Message = require('./Database/message');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PubSub,withFilter } = require('graphql-subscriptions');

const pubsub=new PubSub();

const resolvers = {
  Query: {
    users: async (_,{sender}) => {
      return await usermodel.find({ _id: { $ne: sender } });
    },
    messagesbyUser: async (_, { sender,reciver }) => {
      return await Message.find({
        $or: [
          { sender: sender, reciver: reciver },
          { sender: reciver, reciver: sender }
        ]
      }).sort({ timestamp: 1 });
    },
  },

  Mutation: {
    createUser: async (_, { name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await usermodel.create({ name, email, password: hashedPassword });
      const token = jwt.sign({ id: user._id }, "1234");
      return { user, token };
    },

    login: async (_, { email, password }) => {
      const user = await usermodel.findOne({ email });
      if (!user) throw new Error("User not found");

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) throw new Error("Invalid password");

      const token = jwt.sign({ id: user._id }, "1234");
      return { user, token };
    },

    createMessage: async (_, { reciver,sender, message }, { userId }) => {

      const newMessage = await Message.create({ reciver, sender, message });

      pubsub.publish('NEW_MESSAGE', { messageSent: newMessage });

      return newMessage;
    },
  },

  Subscription: {
    messageSent: {
      subscribe: withFilter(
        ()=>{
          return pubsub.asyncIterableIterator('NEW_MESSAGE');        
        },
        (payload,variable)=>{
          return ((String(payload.messageSent.sender)===String(variable.sender) &&
          String(payload.messageSent.reciver)===String(variable.reciver))
          ||
          (String(payload.messageSent.sender)===String(variable.reciver) &&
          String(payload.messageSent.reciver)===String(variable.sender))
        );
        }
      ),
      resolve:(payload)=>{
        try{
          return payload.messageSent;
        }
        catch(error){
          throw new Error("Failed to resolve messageSent subscription: " + error);
        }
      }
    },
  },

  User: {
    id: (parent) => parent._id.toString(),
    name: (parent) => parent.name ?? null,
  },

  Message: {
    sender: async (parent) => await usermodel.findById(parent.sender),
    reciver: async (parent) => await usermodel.findById(parent.reciver),
  },
};

module.exports=resolvers;
