

const array = [];


const findUserIndex = (msgSenderId) => {
  return array.findIndex((user) => user.id === msgSenderId);
};

export const addPoints = (msgSenderId) => {
  const index = findUserIndex(msgSenderId);
  if (index === -1) {
    array.push({ id: msgSenderId, points: 1 });
  } else {
    array[index].points += 1;
  }
};

export const subtractPoints = (msgSenderId) => {
  const index = findUserIndex(msgSenderId);
  if (index === -1) {
    array.push({ id: msgSenderId, points: 0 }); 
  } else {
    array[index].points = Math.max(0, array[index].points - 1); 
  }
};


export const getResults = () => {
  return array
    .sort((a, b) => b.points - a.points)
    .map((user) => ({
      id: user.id,
      points: user.points,
    }));
}