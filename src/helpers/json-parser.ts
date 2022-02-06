export const parseJson = (body: string | JSON) => {
  let result: JSON;

  try {
    result = typeof (body) === 'string' ? JSON.parse(body) : body;
  } catch (error) {
    result = {} as JSON;
  }

  return result;
};
