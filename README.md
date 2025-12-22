# HILDA

**Human In the Loop Deployment Agent**

HILDA is an intelligent deployment workflow system built with Next.js 15, TypeScript, and Tailwind CSS. It leverages LangGraph for orchestrating complex deployment processes with human oversight and approval checkpoints.

## 🚀 Features

- **🤖 LangGraph Workflows**: State-based deployment orchestration with AI-powered decision making
- **👥 Human-in-the-Loop**: Critical deployment steps require human approval
- **🔗 GitHub Integration**: Seamless webhook integration for deployment triggers
- **🗄️ Supabase Backend**: Persistent storage for deployment state and approval history
- **⚡ Next.js 15**: Built with the latest Next.js features including App Router and Server Actions
- **🎨 Tailwind CSS**: Modern, responsive UI components

## 📁 Project Structure

```
hilda/
├── ai/                      # LangGraph workflows and agent logic
│   ├── workflows/          # Workflow definitions
│   ├── nodes/             # Individual workflow nodes
│   └── README.md
├── lib/                    # Shared libraries and clients
│   ├── supabase.ts        # Supabase client configuration
│   ├── octokit.ts         # GitHub Octokit client
│   └── README.md
├── components/             # React UI components
│   ├── ui/                # Reusable UI components
│   └── README.md
├── types/                  # TypeScript type definitions
│   ├── database.ts        # Database schema types
│   ├── agent-state.ts     # AgentState for LangGraph
│   └── README.md
├── app/                    # Next.js App Router
│   ├── api/
│   │   └── webhooks/      # Webhook endpoints
│   │       └── github/    # GitHub webhook handler
│   ├── actions/           # Server Actions
│   │   └── deployments.ts # Deployment management actions
│   ├── layout.tsx
│   └── page.tsx
└── .env.example           # Environment variables template
```

## 🛠️ Setup

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- A Supabase account
- A GitHub Personal Access Token
- An Anthropic API key (for Claude)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/harshit110927/hilda.git
cd hilda
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` with your credentials:
```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_KEY=your-supabase-anon-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GITHUB_TOKEN=your-github-personal-access-token
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
npm run start
```

## 🌐 Deployment

### Vercel (Recommended)

The easiest way to deploy HILDA is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/harshit110927/hilda)

Make sure to configure your environment variables in the Vercel dashboard.

### Other Platforms

HILDA can be deployed to any platform that supports Next.js applications:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Docker

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_KEY` | Your Supabase anon/public key | Yes |
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude | Yes |
| `GITHUB_TOKEN` | GitHub Personal Access Token | Yes |

## 📚 Technologies

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **AI Orchestration**: [LangGraph](https://github.com/langchain-ai/langgraph)
- **Database**: [Supabase](https://supabase.com/)
- **GitHub Integration**: [Octokit](https://github.com/octokit/rest.js)
- **LLM**: [Anthropic Claude](https://www.anthropic.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the terms specified in the LICENSE file.

## 🙏 Acknowledgments

Built with ❤️ using modern web technologies and AI orchestration frameworks.
