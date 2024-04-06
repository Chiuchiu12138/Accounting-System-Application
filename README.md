# BookBreeze

An accounting web app which allows users to track their finances.

## Demo

Visit https://bookbreeze-two.vercel.app/ to test the app.

A downside of the free hosting that I found is that the server that hosts the backend takes a while to "wake up" after receiving a first request. So if the first login attempt doesn't work, wait a couple minutes for the server to cold start and then reload the page and try again. It should be smooth after that.

![alt text](https://i.imgur.com/0loWoJJ.png)

When signing up, the website sends an email to your email address with a link to click. This process verifies that you signing up with a real email.

Unfortunately though, AWS has not yet approved my request for AWS SES production level access so I can't send emails to email addresses that I don't own.

Since the signup will not work for that reason, you can just skip the signup process and login with this public test account instead:

#### bookbreezewebapp@gmail.com

#### password123

Here are screenshots of what the signup would look like if you were able to test it:

![alt text](https://i.imgur.com/bkujPlP.png)
![alt text](https://i.imgur.com/FuXDCl1.png)
![alt text](https://i.imgur.com/CNlKWyB.png)

## Run Locally

Clone the project

```bash
  git clone https://github.com/Chiuchiu12138/Accounting-System-Application.git
```

Go to the project directory

```bash
  cd Accounting-System-Application
```

### Frontend

Go to the frontend folder

```bash
  cd accounting-system
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

### Backend

Go to the backend folder

```bash
  cd backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run develop
```

Keep in mind: The project needs some environment variables in order to start. These variables contain sensitive info though, so they can't be shared publicly on Github. Because of this I will send you these variables privately with instructions on where to put them.

## Running Tests

To run tests, run the following command

```bash
  cd accounting-system
```

```bash
  npm run test
```
