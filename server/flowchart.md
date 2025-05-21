```mermaid
graph TD
    A[Start Project] --> B{Install Tools}
    B --> C[Create folder: photo-sharing-app]
    C --> D[Add client and server folders]
    D --> E[Open server in VS Code]
    E --> F[npm init -y]
    F --> G[Install express, mongoose, bcryptjs, jwt, dotenv]
    G --> H{Initial server setup}
    H --> I[Create server.js and set type: module]
    I --> J[Create .env with PORT and keys]
    J --> K[Load dotenv in server.js]
    K --> L[Install nodemon and add dev script]

    L --> M{Modeling}
    M --> N[Create models folder]
    N --> O[Define User and Image schema]
    O --> P[Add timestamps option]
    P --> Q[Export models]

    Q --> R{Connect DB}
    R --> S[Create config/db.js]
    S --> T[Connect using mongoose]
    T --> U[Call connectDB in server.js]
    U --> V[Check DB connection log]

    V --> W{Controllers}
    W --> X[Create controllers folder]
    X --> Y[Create authController.js]
    Y --> Z[Add registerUser function]
    Z --> AA[Get data from req.body]
    AA --> AB[Validate and check user]
    AB --> AC[Hash password with bcryptjs]
    AC --> AD[Create user with User.create]
    AD --> AE[Generate JWT and send 201]

    AE --> AF{Routes}
    AF --> AG[Create routes folder]
    AG --> AH[Define POST /register]
    AH --> AI[Connect routes in server.js]

    AI --> AJ{Testing}
    AJ --> AK[Run server with npm run dev]
    AK --> AL[Test with Postman or Insomnia]
    AL --> AM[Check DB for new user]

    AM --> AN[✅ Done!]
