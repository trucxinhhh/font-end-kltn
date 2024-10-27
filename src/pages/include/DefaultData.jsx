// DefaultData.jsx
export const CO2_MIN = 300;
export const CO2_MAX = 600;

export const Humi_MIN = localStorage.getItem("low");
export const Humi_MAX = localStorage.getItem("up");

export const Temp_MIN = 25;
export const Temp_MAX = 40;

export const EC_MIN = 0;
export const EC_MAX = 300;

export const pH_MIN = 0;
export const pH_MAX = 600;

// -------------------------OVER VIEW-----------------------
export const nameTitle_ov = "Over View";
export const title_1_ov = "TITLE 1";
export const title_2_ov = "TITLE 2";
export const title_3_ov = "TITLE 3";
export const paragraph_1_ov =
  " P1OV - Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique saepe exercitationem numquam, labore necessitatibus deleniti quasi. Illo porro nihil necessitatibus debitis delectus aperiam, fuga impedit assumenda odit, velit eveniet est.";

export const paragraph_2_ov =
  " P2OV - Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique saepe exercitationem numquam, labore necessitatibus deleniti quasi. Illo porro nihil necessitatibus debitis delectus aperiam, fuga impedit assumenda odit, velit eveniet est.";

export const paragraph_3_ov =
  " P3OV - Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique saepe exercitationem numquam, labore necessitatibus deleniti quasi. Illo porro nihil necessitatibus debitis delectus aperiam, fuga impedit assumenda odit, velit eveniet est.";

// -------------------------INTRODUCTTION PROJECT-----------------------
export const nameTitle_inf = "Introduction Project";
export const title_1_inf = "TITLE 1";
export const title_2_inf = "TITLE 2";
export const title_3_inf = "TITLE 3";
export const paragraph_1_inf =
  " P1inf - Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique saepe exercitationem numquam, labore necessitatibus deleniti quasi. Illo porro nihil necessitatibus debitis delectus aperiam, fuga impedit assumenda odit, velit eveniet est.";

export const paragraph_2_inf =
  " P2inf - Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique saepe exercitationem numquam, labore necessitatibus deleniti quasi. Illo porro nihil necessitatibus debitis delectus aperiam, fuga impedit assumenda odit, velit eveniet est.";

export const paragraph_3_inf =
  " P3inf - Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique saepe exercitationem numquam, labore necessitatibus deleniti quasi. Illo porro nihil necessitatibus debitis delectus aperiam, fuga impedit assumenda odit, velit eveniet est.";
// -------------------------US-----------------------
export const nameTitle_US = "Us";
export const title_1_US = "TITLE 1";
export const title_2_US = "TITLE 2";
export const title_3_US = "TITLE 3";
export const paragraph_1_US =
  " P1US - Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique saepe exercitationem numquam, labore necessitatibus deleniti quasi. Illo porro nihil necessitatibus debitis delectus aperiam, fuga impedit assumenda odit, velit eveniet est.";

export const paragraph_2_US =
  " P2US - Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique saepe exercitationem numquam, labore necessitatibus deleniti quasi. Illo porro nihil necessitatibus debitis delectus aperiam, fuga impedit assumenda odit, velit eveniet est.";

export const paragraph_3_US =
  " P3US - Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique saepe exercitationem numquam, labore necessitatibus deleniti quasi. Illo porro nihil necessitatibus debitis delectus aperiam, fuga impedit assumenda odit, velit eveniet est.";

export const auto_1 = "";
export const auto_2 = "";
export const manual_1 =
  "Chế độ bơm thủ công là chế độ điều khiển trạng thái Bật/Tắt (ON/OFF) của máy bơm tuỳ theo người dùng yêu cầu. ";
export const manual_2 =
  "Để thay đổi trạng thái của máy bơm, người dùng thực hiện nhấn vào nút điều khiển sau đó nhập mật khẩu người dùng để xác nhận thao tác thay đổi trạng thái máy bơm. Chờ trong vài giây để hoàn tất thay đổi trạng thái máy bơm. ";
export const sequent_1 =
  " Chế độ bơm liên tục là chế độ điều khiển máy bơm theo chu kỳ, trong đó Time On là thời gian máy bơm hoạt động và Time Off là thời gian máy bơm ngừng hoạt động (tính bằng phút).";
export const sequent_2 =
  "Giả sử: Time On = 180 phút và Time Off = 30 phút. Máy bơm sẽ hoạt động trong 180 phút. Sau khi hết thời gian hoạt động (Time On), máy bơm sẽ ngừng trong 30 phút (Time Off) và sau đó tự động khởi động lại chu kỳ.";
export const schedule_1 = "";
export const schedule_2 = "";

export const DataMap = {
  CO2_MIN,
  CO2_MAX,
  Temp_MIN,
  Temp_MAX,
  Humi_MIN,
  Humi_MAX,
  EC_MIN,
  EC_MAX,
  pH_MIN,
  pH_MAX,
};

export const ParaGraph = {
  // overview
  nameTitle_ov,
  title_1_ov,
  title_2_ov,
  title_3_ov,
  paragraph_1_ov,
  paragraph_2_ov,
  paragraph_3_ov,
  //INFOR
  nameTitle_inf,
  title_1_inf,
  title_2_inf,
  title_3_inf,
  paragraph_1_inf,
  paragraph_2_inf,
  paragraph_3_inf,
  //US
  nameTitle_US,
  title_1_US,
  title_2_US,
  title_3_US,
  paragraph_1_US,
  paragraph_2_US,
  paragraph_3_US,
};

export const UserManual = {
  auto_1,
  auto_2,
  manual_1,
  manual_2,
  sequent_1,
  sequent_2,
  schedule_1,
  schedule_2,
};
