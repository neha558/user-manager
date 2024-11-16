const userSuspendedTemplate = (isSuspended, imageURL) => `
    <!DOCTYPE html
PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>PublicPoll Reset Password</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;1,200&family=Poppins:ital,wght@0,200;0,300;1,200&family=Quicksand:wght@300;400;500&display=swap"
      rel="stylesheet">
    <style>
      body {
        background-color: #FFFFFF;
        padding: 0;
        margin: 0;
      }
      .font-family-quicksand {
        font-family: 'Quicksand', sans-serif;
      }
      .font-family-poppins {
        font-family: 'Poppins', sans-serif;
      }
      .font-family-nunito {
        font-family: 'Nunito', sans-serif;
      }
      .title-font-style {
        font-size: 25px;
        font-weight: bold;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.64;
        letter-spacing: normal;
        color: #252122;
        font-family: 'Quicksand', sans-serif;
      }
      .description-font-style {
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 1.75;
        letter-spacing: normal;
        color: black;
        margin: 25.1px 0 0;
      }
      .handle-class{
        background-repeat: no-repeat;
        background-position: top;
        background-size: contain;
      }

      .flex-parent {
        display: flex;
        margin: 1% 2%;
      }
      .image-wrapper{
        width: 40%;
        text-align: left;
      }

      .social-icons {
        width: 60%;
        text-align: right;
        float: right;
        padding-top: 10px;
      }

      .social-icons .social-icon-link {
        margin-right: 15px;
        color: transparent;
      }
      .copy-right-wrapper {
        font-size: 12px;
        font-weight: 300;
        font-stretch: normal;
        font-style: normal;
        line-height: 2.93;
        letter-spacing: normal;
        text-align: center;
        color: #000;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .copy-right-wrapper span{
          padding: 10px;
      }
      .total-participants{
          color: #278CCC;
          font-weight: bold;
      }
      .poll-title{
        font-weight: bold;
      }
      .statistics-block{
        border: solid 1px #e9e9e9;
        border-radius: 5px;
        margin-top: 20px;
        padding: 10px;
      }
      .statistics-title{
        text-align: start;
        font-size: 16px;
        font-weight: bold;
      }
      .statistic-item{
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
      }
      .statistics-name{
        font-size: 14px;
      }
      .statistics-value{
        font-size: 14px;
      }
      .progressbar-wrapper{
        margin-top: 5px;
      }
    </style>
  </head>
  <body style="padding: 0 2%;background: rgb(236,236,236);margin: auto;">
  <div style='text-align: center; padding:50px 0px 20px;' class="description-font-style">
        <img src="${imageURL}/assets/email-logo.png" />
    </div>

    <div class='handle-class' style="background-color: #fff;max-width: 612px;margin: auto;">
    <img style='width: 612px; text-align: center;' src="${imageURL}/assets/email-banner.png" />

      <div style='text-align: center;padding: 0 50px 50px;' class="font-family-quicksand">
        <div style='text-align: center;' class="description-font-style">
        </div>
        <div>
        <p>
        Your profile has been ${isSuspended} by admin, please contact Public Poll support team for the same.
        </p>

      </div>
        <br/>
    </div>
    </div>
    <div style="text-align: center;margin: 20px auto;">
    <span style="margin-right:20px; position: relative; bottom: 8px;">Connect with us at</span>
    <span style="margin-right:10px;">
      <!-- facebook ICON START  -->
      <a style="color: rgb(236,236,236);" href="${imageURL}" target="_blank">
        <img src="${imageURL}/assets/icons/facebook.png" alt="facebook"/>
      </a>
    </span>
     <span style="margin-right:10px;">
      <!-- twitter ICON START  -->
      <a style="color: rgb(236,236,236);" href="${imageURL}" target="_blank">
        <img src="${imageURL}/assets/icons/twitter.png" alt="facebook"/>
      </a>
    </span>
    <span style="margin-right:10px;">
    <!-- instagram ICON START  -->
    <a style="color: rgb(236,236,236);" href="${imageURL}" target="_blank">
      <img src="${imageURL}/assets/icons/instagram.png" alt="facebook"/>
    </a>
  </span>
  <span style="margin-right:10px;">
  <!-- linkedin ICON START  -->
  <a style="color: rgb(236,236,236);" href="${imageURL}" target="_blank">
    <img src="${imageURL}/assets/icons/linkedin.png" alt="facebook"/>
  </a>
</span>

  </div>
  </body>
  </html>
    `;
export default userSuspendedTemplate;
