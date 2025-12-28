# Serverless Order Flow Simulator

A modern Next.js application that visually simulates an AWS serverless architecture flow when adding a product.

## Features

- 🎨 Modern dark theme UI with Tailwind CSS
- ✨ Smooth animations using Framer Motion
- 🔄 Real-time visualization of AWS serverless flow
- 📱 Responsive design
- 🎯 Clean component architecture

## Tech Stack

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion**

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Architecture

The application simulates the following AWS serverless flow:

1. **API Gateway** - Receives the request
2. **Lambda Function** - Processes the request
3. **SQS Queue** - Stores the message
4. **Lambda Function** - Polls and processes the message
5. **DynamoDB** - Stores the data
6. **SNS** - Sends notification

## Project Structure

```
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Main page
│   └── globals.css      # Global styles
├── components/
│   ├── AddProductForm.tsx   # Product form component
│   ├── FlowDiagram.tsx      # Main flow orchestrator
│   ├── AwsNode.tsx          # AWS service card component
│   └── AnimatedEdge.tsx     # Animated connection lines
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## License

MIT

