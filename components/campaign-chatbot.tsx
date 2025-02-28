"use client"

import { useState, useEffect, useRef } from "react"
import { X, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type DonationInfo = {
  firstName: string
  lastName: string
  email: string
  address: string
  city: string
  state: string
  zip: string
}

type ChatStep =
  | { type: "intro" }
  | { type: "options" }
  | { type: "chat" }
  | { type: "donate" }
  | { type: "volunteer" }
  | { type: "contact" }
  | { type: "askFirstName" }
  | { type: "askLastName" }
  | { type: "askEmail" }
  | { type: "askAddress" }
  | { type: "askCity" }
  | { type: "askState" }
  | { type: "askZip" }
  | { type: "confirmInfo" }
  | { type: "provideLink" }

type Message = {
  text: string
  isUser: boolean
  isOption?: boolean
  isLink?: boolean
  isButton?: boolean
}

const CampaignChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<ChatStep>({ type: "intro" })
  const [showOptions, setShowOptions] = useState(true)
  const [donationInfo, setDonationInfo] = useState<DonationInfo>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })
  const [messages, setMessages] = useState<Message[]>([])
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [showConfirmButtons, setShowConfirmButtons] = useState(true)

  useEffect(() => {
    const scrollToBottom = () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
      }
    }

    // Add a small delay to ensure the new content is rendered before scrolling
    const timeoutId = setTimeout(scrollToBottom, 100)

    return () => clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    if (currentStep.type === "intro") {
      addMessageWithDelay("Welcome to Tom Emmer's campaign chatbot! How can I assist you today?", false)
      setCurrentStep({ type: "options" })
    } else if (currentStep.type === "options") {
      addMessageWithDelay("Please select an option:", false)
      addMessageWithDelay("Donate", false, true)
      addMessageWithDelay("Volunteer", false, true)
      addMessageWithDelay("Contact", false, true)
      addMessageWithDelay("General Inquiries", false, true)
    }
  }, [currentStep])

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  const addMessageWithDelay = async (
    text: string,
    isUser: boolean,
    isOption = false,
    isLink = false,
    isButton = false,
  ) => {
    if (isUser) {
      setMessages((prev) => [...prev, { text, isUser, isOption, isLink, isButton }])
    } else {
      await delay(1000)
      setMessages((prev) => [...prev, { text, isUser, isOption, isLink, isButton }])
    }
  }

  const handleUserInput = (input: string) => {
    addMessageWithDelay(input, true)
    setTimeout(() => processUserInput(input), 1000)
  }

  const processUserInput = (input: string) => {
    switch (currentStep.type) {
      case "donate":
      case "askFirstName":
      case "askLastName":
      case "askEmail":
      case "askAddress":
      case "askCity":
      case "askState":
      case "askZip":
      case "confirmInfo":
        handleDonationStep(input)
        break
      case "options":
        handleOptionSelection(input)
        break
      case "chat":
        // Simulate AI response (replace with actual AI integration later)
        setTimeout(() => {
          addMessageWithDelay(
            "I'm an AI assistant for Tom Emmer's campaign. How can I help you with your inquiry?",
            false,
          )
        }, 1000)
        break
      case "volunteer":
        addMessageWithDelay(
          "Thank you for your interest in volunteering! Please provide your name, email, and how you'd like to help.",
          false,
        )
        setCurrentStep({ type: "chat" })
        break
      case "contact":
        addMessageWithDelay(
          "To get in touch with the campaign, please provide your name, email, and message. We'll get back to you as soon as possible.",
          false,
        )
        setCurrentStep({ type: "chat" })
        break
      default:
        addMessageWithDelay("I'm not sure how to handle that. Can you please try again?", false)
    }
  }

  const handleOptionSelection = (option: string) => {
    setShowOptions(false)
    setMessages((prevMessages) => prevMessages.filter((msg) => !msg.isOption))

    switch (option.toLowerCase()) {
      case "donate":
        setCurrentStep({ type: "askFirstName" })
        addMessageWithDelay("Great! Let's start the donation process. What's your first name?", false)
        break
      case "volunteer":
        setCurrentStep({ type: "volunteer" })
        processUserInput("volunteer")
        break
      case "contact":
        setCurrentStep({ type: "contact" })
        processUserInput("contact")
        break
      case "general inquiries":
        setCurrentStep({ type: "chat" })
        addMessageWithDelay(
          "Sure, I'd be happy to help with any general inquiries. What would you like to know about Tom Emmer's campaign?",
          false,
        )
        break
      default:
        addMessageWithDelay("I'm sorry, I didn't understand that option. Please try again.", false)
        setCurrentStep({ type: "options" })
        setShowOptions(true)
    }
  }

  const handleDonationStep = async (input: string) => {
    switch (currentStep.type) {
      case "donate":
      case "askFirstName":
        setDonationInfo((prev) => ({ ...prev, firstName: input }))
        setCurrentStep({ type: "askLastName" })
        await addMessageWithDelay("Thank you! Now, what's your last name?", false)
        break
      case "askLastName":
        setDonationInfo((prev) => ({ ...prev, lastName: input }))
        setCurrentStep({ type: "askEmail" })
        await addMessageWithDelay("Got it. What's your email address?", false)
        break
      case "askEmail":
        setDonationInfo((prev) => ({ ...prev, email: input }))
        setCurrentStep({ type: "askAddress" })
        await addMessageWithDelay("Thanks. What's your street address?", false)
        break
      case "askAddress":
        setDonationInfo((prev) => ({ ...prev, address: input }))
        setCurrentStep({ type: "askCity" })
        await addMessageWithDelay("Great. What city do you live in?", false)
        break
      case "askCity":
        setDonationInfo((prev) => ({ ...prev, city: input }))
        setCurrentStep({ type: "askState" })
        await addMessageWithDelay("And what state is that in? (Please use the two-letter abbreviation)", false)
        break
      case "askState":
        setDonationInfo((prev) => ({ ...prev, state: input }))
        setCurrentStep({ type: "askZip" })
        await addMessageWithDelay("Almost done! What's your ZIP code?", false)
        break
      case "askZip":
        setDonationInfo((prev) => ({ ...prev, zip: input }))
        setCurrentStep({ type: "confirmInfo" })
        setShowConfirmButtons(true)
        const formattedInfo = [
          `First Name: ${donationInfo.firstName}`,
          `Last Name: ${donationInfo.lastName}`,
          `Email: ${donationInfo.email}`,
          `Address: ${donationInfo.address}`,
          `City: ${donationInfo.city}`,
          `State: ${donationInfo.state}`,
          `ZIP: ${donationInfo.zip}`,
        ].join("\n")
        await addMessageWithDelay("Great! Here's a summary of the information you provided. Is this correct?", false)
        await addMessageWithDelay(formattedInfo, false)
        await addMessageWithDelay("Yes", false, false, false, true)
        await addMessageWithDelay("Information is Incorrect", false, false, false, true)
        break
      case "confirmInfo":
        setShowConfirmButtons(false)
        if (input.toLowerCase() === "yes") {
          setCurrentStep({ type: "provideLink" })
          const donationLink = generateDonationLink(donationInfo)
          await addMessageWithDelay(`Perfect! Here's your personalized donation link:`, false)
          await addMessageWithDelay(donationLink, false, false, true)
          await addMessageWithDelay(
            "Click the link above to complete your donation. Thank you for your support!",
            false,
          )
          await delay(5000) // Give user time to click the link
          setShowOptions(true)
          setCurrentStep({ type: "options" })
        } else {
          setCurrentStep({ type: "donate" })
          setDonationInfo({
            firstName: "",
            lastName: "",
            email: "",
            address: "",
            city: "",
            state: "",
            zip: "",
          })
          await addMessageWithDelay("I understand. Let's start over. What's your first name?", false)
        }
        break
      default:
        await addMessageWithDelay("I'm not sure how to handle that. Can you please try again?", false)
        setCurrentStep({ type: "options" })
    }
  }

  const generateDonationLink = (info: DonationInfo) => {
    const baseUrl = "https://secure.winred.com/tom-emmer/emmer-for-congress"
    const params = new URLSearchParams({
      sc: "winred-directory",
      money_bomb: "false",
      recurring: "false",
      first_name: info.firstName,
      last_name: info.lastName,
      email: info.email,
      address: encodeURIComponent(info.address),
      city: info.city,
      state: info.state,
      zip: info.zip,
    })
    return `${baseUrl}?${params.toString()}`
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-[#c31e1e] text-white flex items-center justify-center shadow-lg hover:bg-[#a31818] transition-all z-50"
          aria-label="Open chat"
        >
          <MessageSquare className="w-8 h-8" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[600px] bg-white rounded-xl shadow-xl flex flex-col overflow-hidden border border-gray-200 z-50">
          <div className="bg-[#c31e1e] text-white p-4 flex items-center justify-between">
            <h3 className="font-bold">Tom Emmer Campaign Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-[#a31818]"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                {message.isOption && showOptions ? (
                  <button
                    onClick={() => handleOptionSelection(message.text)}
                    className="bg-[#c31e1e] text-white px-4 py-2 rounded-full hover:bg-[#a31818] transition-colors"
                  >
                    {message.text}
                  </button>
                ) : message.isLink ? (
                  <a
                    href={message.text}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline break-all"
                  >
                    {message.text}
                  </a>
                ) : message.isButton && showConfirmButtons ? (
                  <button
                    onClick={() => handleUserInput(message.text)}
                    className="bg-[#c31e1e] text-white px-4 py-2 rounded-full hover:bg-[#a31818] transition-colors mr-2"
                  >
                    {message.text}
                  </button>
                ) : (
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.isUser ? "bg-[#c31e1e] text-white" : "bg-gray-100 text-gray-800"
                    } whitespace-pre-wrap`}
                  >
                    {message.text}
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const input = e.currentTarget.userInput.value
              if (input.trim()) {
                handleUserInput(input.trim())
                e.currentTarget.userInput.value = ""
              }
            }}
            className="p-4 border-t"
          >
            <div className="relative">
              <Input id="userInput" placeholder="Type your message..." className="pr-12" />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 bg-[#c31e1e] hover:bg-[#a31818]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default CampaignChatbot

