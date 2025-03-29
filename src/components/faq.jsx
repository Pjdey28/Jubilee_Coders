import React, { useState } from "react";

const Faq = () => {
  const [openId, setOpenId] = useState(null);
  
  const toggleQuestion = (id) => {
    setOpenId(openId === id ? null : id);
  };
  const questions = [
    {
      id: 1,
      question:
        "What makes you unique?",
      answer:
        "is a one-stop solution for all things creative, seamlessly blending design, strategy, and innovation. From concept to execution, we tailor our approach to meet diverse needs, ensuring every project captivates its audience, enhances brand presence, and delivers lasting impact—all under one roof.",
    },
    {
      id: 2,
      question:
        "Do you offer flexible packages or custom solutions?",
      answer:
        "Yes,  provides flexible packages and custom solutions tailored to each client’s specific requirements. We understand that no two projects are alike, so we collaborate closely with clients to create bespoke service packages that align with their vision, goals, and budget.",
    },
    {
      id: 3,
      question:
        "What types of businesses and industries do you specialize in?",
      answer:
        "We collaborate with businesses of all sizes, from visionary startups to established enterprises. Our expertise transcends industries, shaping compelling narratives and impactful designs across dynamic sectors, ensuring every brand stands out, engages meaningfully, and leaves a lasting impact. This versatility ensures that we provide innovative and effective solutions regardless of business type or industry.",
    },
    {
      id: 4,
      question:
        "What types of businesses and industries do you specialize in?",
      answer:
        "We collaborate with businesses of all sizes, from visionary startups to established enterprises. Our expertise transcends industries, shaping compelling narratives and impactful designs across dynamic sectors, ensuring every brand stands out, engages meaningfully, and leaves a lasting impact. This versatility ensures that we provide innovative and effective solutions regardless of business type or industry.",
    },
  ]
  return (
    <section className="py-[120px]  flex justify-center px-6 lg:px-20">
      <div className="w-full max-w-7xl">
<h1 className="text-6xl lg:text-7xl italic font-[700]">FAQ</h1>
{questions.map(({ id, question, answer }) => (
            <div key={id} onClick={() => toggleQuestion(id)} className=" py-6 cursor-pointer border-b-[1px] border-neutral-800">
              <div className=" font-jakartaSans ">
                <div className="flex justify-between font-rethinkSans ">
                  <h1 className="text-2xl md:text-3xl w-full md:w-[640px] leading-[150%] md:leading-[44px] font-[600] tracking-[-0.64px]">
                    {question}
                  </h1>
                  <svg
                    className={`w-[24px] h-[24px] transition-transform duration-300 hidden md:flex  ${
                      openId === id ? 'rotate-45' : ''
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      id="faqplus"
                      d="M19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.48043 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11Z"
                      fill="#FCFCFD"
                    />
                  </svg>
                </div>

                <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      openId === id ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className=" leading-[150%] font-medium max-w-[640px]">
                        {answer}
                      </p>
                    </div>
                    </div>
                    </div>
                    </div>
                       ))}
      </div>
    </section>
  );
};

export default Faq;
