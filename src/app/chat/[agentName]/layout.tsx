import { MOCK_AGENTS } from '@/lib/constants';

export async function generateStaticParams() {
  return MOCK_AGENTS.map((agent) => ({
    agentName: agent.name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}