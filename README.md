# Plana

Plana is a full-stack event management application designed to streamline the organization and coordination of events. It offers a robust backend API and a dynamic frontend interface, providing users with an efficient platform to manage events seamlessly.

## Features

- **Event Creation and Management**: Easily create, update, and delete events with detailed information.
- **User Authentication**: Secure user registration and login functionalities.
- **Responsive Design**: Optimized for various devices, ensuring a consistent user experience.
- **Image Uploads**: Integrates with Cloudinary for efficient image storage and retrieval.

## Technologies Used

### Backend
- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) **Node.js**: JavaScript runtime for building scalable network applications.
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) **Express.js**: Minimalist web framework for Node.js.
- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) **TypeScript**: Typed superset of JavaScript that compiles to plain JavaScript.
- ![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white) **Prisma ORM**: Next-generation ORM for Node.js and TypeScript.
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) **PostgreSQL**: Open-source object-relational database system.

### Frontend
- ![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white) **Angular 18**: Platform for building dynamic web applications.
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS**: Utility-first CSS framework for rapid UI development.

## Folder Structure

Here's an overview of the folder structure to help you understand the project organization:

```plaintext
plana/
├── backend/
│   ├── prisma/             
│   ├── src/
│   │   ├── controllers/    
│   │   ├── middlewares/     
│   │   ├── models/         
│   │   ├── routes/          
│   │   ├── services/       
│   │   ├── utils/           
│   │   └── index.ts         
│   └── package.json         
│
├── frontend/
│   ├── src/
│   │   ├── app/             
│   │   ├── assets/          
│   │   ├── components/      
│   │   ├── pages/           
│   │   ├── services/       
│   │   └── main.ts          
│   └── package.json         
│
└── README.md               
```

## Getting Started

### Prerequisites

- ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) **Node.js**: Ensure Node.js is installed on your machine.
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white) **PostgreSQL**: Set up a PostgreSQL database.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/victorpreston/plana.git
   ```

2. **Navigate to the Project Directory**:
   ```bash
   cd plana
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   ```

4. **Set Up Environment Variables**:
   Create a `.env` file in the `backend` directory with the following:
   ```env
   DATABASE_URL=your_postgresql_database_url
   CLOUDINARY_URL=your_cloudinary_url
   ```

5. **Run Database Migrations**:
   ```bash
   npx prisma migrate dev
   ```

6. **Start the Backend Server**:
   ```bash
   npm run dev
   ```

7. **Install Frontend Dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

8. **Start the Frontend Server**:
   ```bash
   npm start
   ```

## Usage

Once both servers are running, you can access the application at `http://localhost:4200`. Register or log in to manage and explore events.

## Contributing

Contributions are welcome! Fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.





