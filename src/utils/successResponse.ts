const successResponse = (status: number, message: string, data: any) => {
  return {
    status,
    message,
    data,
  };
};

export default successResponse;
