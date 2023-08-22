INSERT INTO department (department_name)
VALUES ('Human Resources'),
       ('IT'),
       ('Sales'),
       ('Customer Support'),
       ('Marketing');
     
INSERT INTO role (title, salary, department_id)
VALUES ('Staff Coordinator', 45000, 1),
       ('HR Representative', 50000, 1),
       ('HR Director', 90000, 1),
       ('IT Technician', 25000, 2),
       ('IT Project Manager', 50000, 2),
       ('Sales Representative', 40000, 3),
       ('Sales Manager', 50000, 3),
       ('Customer Servervice Assistant', 25000, 4),
       ('Customer Service Rep', 35000, 4),
       ('Customer Service Manager', 50000, 4),
       ('Marketing Assistant', 30000, 5),
       ('Copywriter', 35000, 5),
       ('Manager of Marketing', 50000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Jazmyn', 'Carroll', 3, NULL),
       ('Andy', 'Blackburn', 1, 1),
       ('Eleanor', 'Mata', 2, 1),
       ('Aaden', 'Morse', 5, NULL),
       ('Hope', 'Baldwin', 4, 4),
       ('Alvin', 'Summers', 4, 4),
       ('Ariana', 'Mendoza', 4, 4),
       ('Jaliya', 'Lewis', 7, NULL),
       ('Andrea', 'Morse', 6, 8),
       ('Michelle', 'Bauer', 6, 8),
       ('Kati', 'Villanueva', 6, 8),
       ('Julian', 'Salinas', 10, NULL),
       ('Aleah', 'Archer', 8, 12),
       ('Caitlin', 'Freeman', 9, 12),
       ('Mariana', 'Stokes', 13, NULL),
       ('Cristina', 'Pacheco', 11, 15),
       ('Carmelo', 'Nichols', 12, 15),
       ('Anika', 'Hunt', 12, 15);
       

