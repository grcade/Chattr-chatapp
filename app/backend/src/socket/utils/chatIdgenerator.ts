const generateChatId = (userId1: string, userId2: string): string => {
  const sortedIds = [userId1, userId2].sort();
  return `${sortedIds[0]}-${sortedIds[1]}`;
};

export default generateChatId;
