import emailjs from '@emailjs/browser';

const sendEmail = async (action, type, applicant, recruitmentName, meetingOrAssessmentName, description, additionalData) => {
  if (!applicant?.email) {
    console.error("Applicant email is missing.");
    return;
  }

  // Define email subject and message based on action & type
  let subject = '';
  let message = `👋 Hello ${applicant.name} ${applicant.surname},\n\n`;

  switch (`${action}_${type}`) {
    case 'ADD_MEETING':
      subject = `📅 New Meeting: ${meetingOrAssessmentName} for ${recruitmentName}`;
      message += `✨ A new meeting **${meetingOrAssessmentName}** has been scheduled for **${recruitmentName}**.\n\n🔹 **Details:**\n📅 **Date:** ${additionalData.meetingDate}\n🕒 **Time:** ${additionalData.meetingTimeFrom} - ${additionalData.meetingTimeTo}\n🔗 **Link:** ${additionalData.meetingLink}\n\n📝 ${description}\n\n🚀 Best wishes,\nRecruitHelper Team`;
      break;
    
    case 'REMOVE_MEETING':
      subject = `🚫 Meeting Removed: ${meetingOrAssessmentName}`;
      message += `⚠️ The meeting **${meetingOrAssessmentName}** for **${recruitmentName}** has been **canceled**.\n\n❗ If you have any questions, feel free to reach out.\n\n🙌 Best wishes,\nRecruitHelper Team`;
      break;


    case 'ADD_ASSESSMENT':
      subject = `📝 New Assessment: ${meetingOrAssessmentName} for ${recruitmentName}`;
      message += `✅ A new assessment **${meetingOrAssessmentName}** has been **assigned** for **${recruitmentName}**.\n\n📌 **Deadline:** ${additionalData.assessmentDeadline}\n\n📄 **Description:**\n${description}\n\n🚀 Best of luck!\nRecruitHelper Team`;
      break;

    case 'REMOVE_ASSESSMENT':
      subject = `❌ Assessment Removed: ${meetingOrAssessmentName}`;
      message += `⚠️ The assessment **${meetingOrAssessmentName}** for **${recruitmentName}** has been **removed**.\n\n📩 If you have any concerns, feel free to contact us.\n\n💡 Stay tuned!\nRecruitHelper Team`;
      break;


    default:
      subject = `📢 Notification for ${recruitmentName}`;
      message += `ℹ️ There is an **update** regarding **${meetingOrAssessmentName}** for **${recruitmentName}**.\n\n📝 ${description}\n\n🚀 Best wishes,\nRecruitHelper Team`;
  }



  try {
    console.log('📧 Sending email...');
    
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_NOTIFICATION_TEMPLATE_ID,
      {
        email: applicant.email,
        subject,
        message,
      },
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    console.log('📨 Email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
};

export default sendEmail;
