//notFound >>
// میان افزار برای مدیریت مسیرهای یافت نشده (404)
const notFound = (req, res, next) => {
  const error = new Error(`مسیر یافت نشد - ${req.originalUrl}`);
  res.status(404); // کد وضعیت رو 404 تنظیم می کنیم
  next(error); // خطا رو به error handler بعدی پاس میدیم
};



//errorHandler >>
// میان افزار اصلی برای مدیریت خطاها
const errorHandler = (err, req, res, next) => {
    // گاهی اوقات یک خطا ممکنه کد وضعیت 200 داشته باشه (مثلا اگر خودمون با res.status() ست نکرده باشیم)
    // پس اگر کد وضعیت 200 بود، اون رو به 500 تغییر میدیم، در غیر این صورت از کد وضعیت خود خطا استفاده می کنیم
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;
  
    // برای خطاهای خاص Mongoose مثل خطای ObjectId نامعتبر (CastError)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
      statusCode = 404; // یا 400 Bad Request هم میتونه باشه
      message = 'منبع یافت نشد (شناسه نامعتبر).';
    }
  
    // برای خطاهای Validation از Mongoose (اگر در کنترلرها try...catch نکرده باشیم)
    if (err.name === 'ValidationError') {
      statusCode = 400;
      // پیام های خطا رو از آبجکت errors استخراج می کنیم
      const messages = Object.values(err.errors).map(val => val.message);
      message = `خطای اعتبارسنجی: ${messages.join(', ')}`;
    }
  
    // در محیط توسعه (development) می تونیم stack trace رو هم بفرستیم
    // در محیط پروداکشن (production) بهتره stack trace ارسال نشه
    res.status(statusCode).json({
      message: message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  //------------------------------------------------------------
  export { notFound, errorHandler };


