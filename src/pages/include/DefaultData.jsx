// DefaultData.jsx
export const CO2_MIN = 300;
export const CO2_MAX = 600;

export const Humi_MIN = JSON.parse(localStorage.getItem("low"));
export const Humi_MAX = JSON.parse(localStorage.getItem("up"));

export const Temp_MIN = 25;
export const Temp_MAX = 40;

export const EC_MIN = 0;
export const EC_MAX = 300;

export const Salt_MIN = 0;
export const Salt_MAX = 600;

export const AirHumi_MIN = 0;
export const AirHumi_MAX = 90;

export const AirTemp_MIN = 0;
export const AirTemp_MAX = 50;
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

export const auto = (
  <>
    Chế độ này giúp duy trì độ ẩm đất ở mức phù hợp bằng cách bật hoặc tắt máy
    bơm theo ngưỡng cài đặt.
    <br />
    <strong>Ngưỡng độ ẩm thấp:</strong> Khi độ ẩm đất xuống dưới ngưỡng này, máy
    bơm sẽ bật để bổ sung độ ẩm cho cây.
    <br />
    <strong>Ngưỡng độ ẩm cao: </strong>Khi độ ẩm đất đạt hoặc vượt quá ngưỡng
    này, máy bơm sẽ tắt để tránh tình trạng đất quá ẩm, gây hại cho cây
    <br />
    <strong>Cách thao tác:</strong>
    <br />
    {/* <strong>1. Mốc thời gian bật và tắt</strong> được thiết lập theo định dạng
    HH:MM.
    <br />
    <strong>2. Đặt thời gian bật </strong> tại khung rỗng đầu tiên
    <br />
    <strong>3. Đặt thời gian tắt </strong> tại khung rỗng thứ hai
    <br />
    <strong>4. Cập nhập khung giờ </strong> bằng cách nhấn vào nút "Thêm" và
    nhập mật khẩu để xác nhận.
    <br />
    <strong>5. Chờ vài giây</strong> để cập nhật khung giờ. */}
  </>
);

export const manual = (
  <>
    <strong>Chế độ bơm thủ công:</strong> Người dùng điều khiển trạng thái
    Bật/Tắt (ON/OFF) của máy bơm theo yêu cầu. Chế độ này phù hợp khi người dùng
    muốn điều chỉnh trực tiếp. Để thay đổi trạng thái của máy bơm, người dùng
    nhấn vào nút điều khiển, sau đó nhập mật khẩu để xác nhận thao tác.
    <br />
    <strong>Cách thao tác:</strong>
    <br />
    <strong>1. Nhấn vào nút điều khiển</strong>để thay đổi trạng thái máy bơm
    (Bật/Tắt).
    <br />
    <strong>2. Nhập mật khẩu </strong>để xác nhận thao tác, đảm bảo chỉ những
    người có quyền mới có thể điều khiển máy bơm.
    <br />
    <strong>3. Chờ vài giây</strong>để thay đổi trạng thái máy bơm (Bật/Tắt).
  </>
);

export const sequent = (
  <>
    <strong>Chế độ bơm liên tục:</strong> Máy bơm hoạt động theo chu kỳ, gồm
    thời gian hoạt động (<strong>Time On</strong>) và thời gian ngừng hoạt động
    (<strong>Time Off</strong>), tính bằng phút.
    <br />
    <br /> <strong>Cách thao tác:</strong>
    <br />
    <strong>1. Mốc thời gian bật và tắt</strong> được thiết lập theo định dạng
    HH:MM.
    <br />
    <strong>2. Đặt thời gian bật </strong> tại khung "TimeOn"
    <br />
    <strong>3. Đặt thời gian tắt </strong> tại khung "TimeOff"
    <br />
    <strong>4. Cập nhập khung giờ </strong> bằng cách nhấn vào nút "Thêm" và
    nhập mật khẩu để xác nhận.
    <br />
    <strong>5. Chờ vài giây</strong> để cập nhật khung giờ.
  </>
);

export const schedule = (
  <>
    <strong>Chế độ bơm hẹn giờ </strong>cho phép người dùng thiết lập thời gian
    cụ thể trong ngày để tự động bật và tắt máy bơm.
    {/* Đúng thời gian Bật (TimeOn), máy bơm sẽ tự động khởi động. Máy bơm sẽ giữ
    trạng thái bật cho đến khi đạt thời gian Tắt (TimeOff) và sau đó tự động
    dừng. */}
    <br />
    <br />
    <strong>Cách thao tác:</strong>
    <br />
    <strong>1. Mốc thời gian bật và tắt</strong> được thiết lập theo định dạng
    HH:MM.
    <br />
    <strong>2. Đặt thời gian bật </strong> tại khung rỗng đầu tiên
    <br />
    <strong>3. Đặt thời gian tắt </strong> tại khung rỗng thứ hai
    <br />
    <strong>4. Cập nhập khung giờ </strong> bằng cách nhấn vào nút "Thêm" và
    nhập mật khẩu để xác nhận.
    <br />
    <strong>5. Chờ vài giây</strong> để cập nhật khung giờ.
  </>
);

export const DataMap = {
  CO2_MIN,
  CO2_MAX,
  Temp_MIN,
  Temp_MAX,
  Humi_MIN,
  Humi_MAX,
  EC_MIN,
  EC_MAX,
  Salt_MIN,
  Salt_MAX,
  AirHumi_MIN,
  AirHumi_MAX,
  AirTemp_MIN,
  AirTemp_MAX,
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
  auto,
  manual,
  sequent,
  schedule,
};
