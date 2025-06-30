import React from "react";

const getFunnelPrompt = ({
  jobName,
  description,
  keyBenefits,
  requiredSkills,
}) => {
  return `
  Generate a tailored funnel configuration for our recruitment process based on the detailed job description provided. Ensure that your configuration aligns closely with the unique aspects of the role and our company culture. Please adhere to the following additional guidelines to enhance the quality of the output:
  
________
  Job title: ${jobName}
________
  Job description: ${description}
________
  Key benefits of the job: ${keyBenefits}
________
  Required skills: ${requiredSkills}
________

  The funnel configuration should be tailored specifically for the job vacancy described. Use the EVP framework to write compelling text. Below is the required formats' mongodb model (This model serves only as an example for the data structure. Ignore the content.):
  {
    heroTitle: {
      type: String,
    },
    valueProposition: {
      type: String,
    },
    optionOne: { type: String, default: "Start today" },
    optionTwo: { type: String, default: "Tell me more" },
    benefitsTitle: { type: String, default: "Your Exclusive Benefits with Us" },
    benefits: {
      type: [
        {
          title: String,
          description: String,
          icon: String,
        },
      ],
      default: [
        {
          title: "Innovative Projects",
          description:
            "Engage in cutting-edge development projects that push the boundaries of human.",
          icon: "🚀",
        },
        {
          title: "Continuous Learning",
          description:
            "Gain access to continuous professional development opportunities, including workshops, courses, and conferences.",
          icon: "💡",
        },
        {
          title: "Collaborative Culture",
          description:
            "Work in a dynamic team environment that fosters collaboration and sharing of creative ideas.",
          icon: "👥",
        },
        {
          title: "Toolkit",
          description:
            "Utilize a modern technologies and the latest industry tools to create high-quality product.",
          icon: "🧰",
        },
        {
          title: "Remote Flexibility",
          description:
            "Enjoy the flexibility of remote work options, allowing you to create a comfortable and productive workspace wherever you are.",
          icon: "🏠",
        },
        {
          title: "Creative Freedom",
          description:
            "Have the freedom to innovate and contribute to open source projects, bringing your own ideas to life and improving our community.",
          icon: "✨",
        },
      ],
    },
    benefitsTitle: { type: String, default: "Here are your key benefits" },
    benefitsText: {
      type: String,
    },

    testimonialTitle: {
      type: String,
      default: "Insights from Our Passionate Team",
    },
    testimonialSubheader: {
      type: String,
      default: "Insights from Our Passionate Team",
    },
    teamTestimonials: {
      type: [
        {
          author: String,
          authorPosition: String,
          testimonial: String,
        },
      ],
      default: [
        {
          author: "Alex Johnson",
          authorPosition: "Senior XY",
          testimonial:
            "Working at this company has been a game-changer for me. ...",
        },
        {
          author: "Samantha Lee",
          authorPosition: "XY Designer",
          testimonial:
            "Collaborating with the ...",
        },
      ],
    },
    CTA: { type: String, default: "Apply in 60 seconds! 🐱‍🏍" },
    thankYouHero: {
      type: String,
      default: "Thank You for Your Application!",
    },
    underReviewInfo: {
      type: String,
      default:
        "👓 Your application is now under review. We appreciate your enthusiasm for the position. Our team is diligently working to assess your submission, and we aim to respond promptly.",
    },
    nextSteps: {
      type: String,
      default:
        "🔄 Next Steps: You'll receive an update from us shortly. If you're selected for the next phase, we'll invite you to an interview. This will be a great opportunity to discuss how your passion aligns with our mission.",
    },
  }


Important points:
  1. **Specificity**: Customize the "heroTitle" and "valueProposition" to reflect the specific role and its key benefits. Avoid generic statements; instead, focus on what makes this opportunity unique.
  2. **Relevance**: For the "benefits" section, ensure that each benefit is directly relevant to the described position. Think about what a candidate in this role would value most and how the role meets those expectations.
  3. **Clarity**: Write clear and concise descriptions. Avoid jargon and overly complex language to ensure that the message is accessible to a wide range of candidates.
  4. **Engagement**: Craft the "CTA" (Call To Action) to be compelling and action-oriented. Encourage candidates to take the next step with language that excites and motivates.
  5. **Authenticity**: Ensure the "teamTestimonials" reflect real sentiments from current team members. This can include specific examples of projects, personal growth stories, or how the team collaborates.
  6. **Visual Appeal**: Include relevant emojis or symbols in the "icon" fields of the benefits section to create a visually appealing and intuitive understanding of each benefit.


IMPORTANT: Ensure that the funnel has exactly 6 benefits!
IMPORTANT: Ensure that the funnel has exactly 2 team testimonials!
Prioritize clarity, relevance, and brand alignment in your content. Your attention to detail and creativity in meeting these guidelines will significantly enhance the effectiveness of our recruitment funnel.
Use EVP framework when writing the text copies, especially the benefitsText.

HIGHLY IMPORTANT! In your answer, please do not write anything other than the barebone JSON object according to the above format. Example response would be:
{
  "heroTitle": "xy",
  {...}
  "benefits": [
    { "title": "xy", "description": "xy", "icon": "🚀" },
    {...}
  ],
  "teamTestimonials": [
    {...}
  ]
}


It is imperative that the output text does NOT contain any of the following nor similar words: Embarking on, Unveil, Mastering, Master, Crafting, In Conclusion, Unlock, Unleash, Tapestry, Un the realm, Explore
  `;
};

export default getFunnelPrompt;
