package com.tripplanner.Optimizer.utils;

import java.util.Properties;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailSenderManager {

  @Value("${spring.mail.username}")
  private String senderEmail;

  @Value("${spring.mail.password}")
  private String senderPassword;

  public JavaMailSender getJavaMailSender() {
    JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
    mailSender.setHost("smtp.gmail.com");
    mailSender.setPort(587);

    mailSender.setUsername(senderEmail);
    mailSender.setPassword(senderPassword);

    Properties props = mailSender.getJavaMailProperties();
    props.put("mail.transport.protocol", "smtp");
    props.put("mail.smtp.auth", "true");
    props.put("mail.smtp.starttls.enable", "true");
    props.put("mail.debug", "true");

    return mailSender;
  }

  public void sendSimpleMessageError(String to, String subject, String text) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(senderEmail);
    message.setTo(to);
    message.setSubject(subject);
    message.setText(text);
    this.getJavaMailSender().send(message);
  }

  public void sendSimpleMessage(String to, String subject, String text)
    throws MessagingException {
    MimeMessage mimeMessage = getJavaMailSender().createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
    String htmlMsg =
      "<div style=\"font-family:'Arial','Helvetica Neue','Helvetica',sans-serif;font-size:14px;background-color:#fff;direction:ltr\"><div class=\"adM\">\n" +
      "    </div><table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" height=\"100%\" width=\"100%\">\n" +
      "        <tbody><tr>\n" +
      "            <td align=\"center\" valign=\"top\">\n" +
      "            <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"background:#ffffff;padding:45px 70px;margin-top:15px;width:600px!important\">\n" +
      "                <tbody><tr>\n" +
      "                    <td align=\"center\" valign=\"top\" style=\"padding-bottom:10px\">\n" +
      "                        <div style=\"color:#333;font-size:1.28em;letter-spacing:-0.02em;font-weight:bold\"></div>\n" +
      "                        <div style=\"color:#999;font-size:1.24em;letter-spacing:-0.02em;max-width:370px;margin-top:15px\">\n" +
      "                             Chuyến đi của bạn đã sẵn sàng. <br>Bấm vào link bên dưới để xem chuyến đi phù hợp với bạn.\n" +
      "                        </div>\n" +
      "                    </td>\n" +
      "                </tr>\n" +
      "                <tr>\n" +
      "                    <td align=\"center\" style=\"padding-top:10px\">\n" +
      "<table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
      "  <tbody><tr>\n" +
      "    <td align=\"center\">\n" +
      "      <table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n" +
      "        <tbody><tr>\n" +
      "          <td align=\"center\" style=\"border-radius:100px\" bgcolor=\"#fa8c00\"><a href=\"" +
      text +
      "\" style=\"font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:100px;padding:12px 40px;border:1px solid #fa8c00;display:inline-block\" target=\"_blank\">Xem chuyến đi của bạn</a></td>\n" +
      "        </tr>\n" +
      "      </tbody></table>\n" +
      "    </td>\n" +
      "  </tr>\n" +
      "</tbody></table>\n" +
      "                    </td>\n" +
      "                </tr>\n" +
      "            </tbody></table>\n" +
      "            </td>\n" +
      "        </tr>\n" +
      "    </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
      "    </div></div>";
    helper.setText(htmlMsg, true); // Use this or above line.
    helper.setTo(to);
    helper.setSubject(subject);
    helper.setFrom(senderEmail);
    getJavaMailSender().send(mimeMessage);
  }
}
