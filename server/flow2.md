```mermaid
graph TD
    subgraph Client_Frontend
        UserAction_Register["کاربر اطلاعات ثبت‌نام را وارد می‌کند (username, email, password, ...)"]
        UserAction_Login["کاربر اطلاعات ورود را وارد می‌کند (emailOrUsername, password)"]
    end

    subgraph Server_Backend
        API_Request_Register["دریافت درخواست POST به /api/auth/register"]
        API_Request_Login["دریافت درخواست POST به /api/auth/login"]

        Middleware_JSON["میان‌افزار express.json() بدنه JSON را پارس می‌کند (req.body)"]

        subgraph Auth_Routes
            Route_Register["روت /register"]
            Route_Login["روت /login"]
        end

        subgraph Auth_Controller
            Func_RegisterUser["تابع registerUser(req, res)"]
            Func_LoginUser["تابع loginUser(req, res)"]

            Validate_Register_Input["اعتبارسنجی ورودی‌های ثبت‌نام"]
            Check_User_Exists_Register["بررسی وجود کاربر (email/username)"]
            Hash_Password["هش کردن پسورد (bcrypt.hash)"]
            Create_User_DB["ایجاد کاربر جدید در DB (User.create)"]
            Generate_JWT_Register["ساخت توکن JWT برای کاربر جدید"]
            Send_Response_Register["ارسال پاسخ به کلاینت (اطلاعات کاربر + توکن)"]

            Validate_Login_Input["اعتبارسنجی ورودی‌های لاگین"]
            Find_User_DB_Login["جستجوی کاربر در DB (User.findOne با email/username)"]
            Compare_Password["مقایسه پسورد ورودی با پسورد هش شده در DB (bcrypt.compare)"]
            Generate_JWT_Login["ساخت توکن JWT برای کاربر موجود"]
            Send_Response_Login["ارسال پاسخ به کلاینت (اطلاعات کاربر + توکن)"]

            Error_Handling_400["ارسال خطای 400 (Bad Request - ورودی نامعتبر)"]
            Error_Handling_401["ارسال خطای 401 (Unauthorized - احراز هویت ناموفق)"]
            Error_Handling_500["ارسال خطای 500 (Server Error)"]
        end

        subgraph User_Model
            Schema_User["UserSchema (تعریف فیلدها: username, email, password, ...)"]
            DB_Interaction_Create["تعامل با DB: ایجاد سند جدید"]
            DB_Interaction_FindOne["تعامل با DB: جستجوی یک سند"]
        end

        subgraph Database_MongoDB
            Collection_Users["کالکشن Users"]
        end

        subgraph JWT_Module
            Sign_Token["jwt.sign() برای ساخت توکن"]
        end

        subgraph Bcrypt_Module
            Hash_Func["bcrypt.hash()"]
            Compare_Func["bcrypt.compare()"]
        end

        subgraph Env_Variables
            JWT_SECRET_VAR["JWT_SECRET"]
        end
    end

    %% --- جریان ثبت‌نام ---
    UserAction_Register --> API_Request_Register
    API_Request_Register --> Middleware_JSON
    Middleware_JSON --> Route_Register
    Route_Register --> Func_RegisterUser

    Func_RegisterUser --> Validate_Register_Input
    Validate_Register_Input --> Func_RegisterUser
    Func_RegisterUser --> Check_User_Exists_Register
    Check_User_Exists_Register --> DB_Interaction_FindOne
    DB_Interaction_FindOne --> Schema_User
    DB_Interaction_FindOne --> Collection_Users
    Collection_Users --> DB_Interaction_FindOne
    DB_Interaction_FindOne --> Check_User_Exists_Register
    Check_User_Exists_Register --> Func_RegisterUser

    Func_RegisterUser --> Hash_Password
    Hash_Password --> Bcrypt_Module
    Bcrypt_Module --> Hash_Password
    Hash_Password --> Func_RegisterUser

    Func_RegisterUser --> Create_User_DB
    Create_User_DB --> DB_Interaction_Create
    DB_Interaction_Create --> Schema_User
    DB_Interaction_Create --> Collection_Users
    Collection_Users --> DB_Interaction_Create
    DB_Interaction_Create --> Func_RegisterUser

    Func_RegisterUser --> Generate_JWT_Register
    Generate_JWT_Register --> Sign_Token
    Sign_Token --> JWT_SECRET_VAR
    JWT_SECRET_VAR --> Sign_Token
    Sign_Token --> Generate_JWT_Register
    Generate_JWT_Register --> Func_RegisterUser

    Func_RegisterUser --> Send_Response_Register
    Send_Response_Register --> Client_Frontend
    Func_RegisterUser --> Error_Handling_400
    Func_RegisterUser --> Error_Handling_500
    Error_Handling_400 --> Client_Frontend
    Error_Handling_500 --> Client_Frontend

    %% --- جریان لاگین ---
    UserAction_Login --> API_Request_Login
    API_Request_Login --> Middleware_JSON
    Middleware_JSON --> Route_Login
    Route_Login --> Func_LoginUser

    Func_LoginUser --> Validate_Login_Input
    Validate_Login_Input --> Func_LoginUser
    Func_LoginUser --> Find_User_DB_Login
    Find_User_DB_Login --> DB_Interaction_FindOne
    DB_Interaction_FindOne --> Schema_User
    DB_Interaction_FindOne --> Collection_Users
    Collection_Users --> DB_Interaction_FindOne
    DB_Interaction_FindOne --> Func_LoginUser

    Func_LoginUser --> Compare_Password
    Compare_Password --> Compare_Func
    Compare_Func --> Bcrypt_Module
    Bcrypt_Module --> Compare_Func
    Compare_Func --> Func_LoginUser

    Func_LoginUser --> Generate_JWT_Login
    Generate_JWT_Login --> Sign_Token
    Generate_JWT_Login --> Func_LoginUser

    Func_LoginUser --> Send_Response_Login
    Send_Response_Login --> Client_Frontend
    Func_LoginUser --> Error_Handling_401
    Func_LoginUser --> Error_Handling_500
    Error_Handling_401 --> Client_Frontend
