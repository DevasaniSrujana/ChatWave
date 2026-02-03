import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import { Message } from "../models/message.models.js";
import { Conversation } from "../models/conversation.models.js";
import { getId, io } from "../socket/socket.js";

export const sendMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;
  const message = req.body.message;

  if (!senderId || !receiverId || !message) {
    return next(new errorHandler("All fields are required", 400));
  }
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  });
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }
  const newMessage = await Message.create({
    senderId,
    receiverId,
    message,
  });
  if (newMessage) {
    conversation.messages.push(newMessage._id);
    await conversation.save();
  }
  //socket.io
  const receiverSocketIds = getId(String(receiverId));
  const senderSocketIds = getId(String(senderId));

  const emitToSockets = (socketIds) => {
    if (!socketIds) return;
    socketIds.forEach((socketId) => {
      io.to(socketId).emit("newMessage", newMessage);
    });
  };

  emitToSockets(receiverSocketIds); // receiver devices
  emitToSockets(senderSocketIds); // sender devices (helps keep UI in sync)

  res.status(200).json(newMessage);
});

export const getMessage = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const receiverId = req.params.receiverId;

  if (!senderId || !receiverId) {
    return next(new errorHandler("All fields are required", 400));
  }
  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, receiverId] },
  }).populate("messages");
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, receiverId],
    });
  }
  res.status(200).json(conversation.messages);
});
