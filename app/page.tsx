import CampaignChatbot from "@/components/campaign-chatbot"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* This would be your existing website content */}
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Campaign Website Demo</h1>
        <p className="text-center text-gray-600 mb-4">
          This is a demonstration of how the chatbot would integrate with an existing website.
        </p>
        <p className="text-center text-gray-600">Look for the chat bubble in the bottom-right corner.</p>
      </div>

      {/* The chatbot widget */}
      <CampaignChatbot />
    </main>
  )
}

