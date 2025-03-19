const Footers = () => {
  return (
    <footer className="bg-black text-white py-10 px-[50px]">
      <div className="flex justify-around items-center">
        <div className="flex flex-col gap-5 max-w-[500px]">
          <div className="flex gap-1 text-xl font-bold">
            <span className="text-orange-400">F5</span>
            <span>FASHION</span>
            <span>- Thời trang công sở</span>
          </div>
          <div className="flex flex-col gap-2 text-base">
            <div>Công ty TNHH Dịch vụ và DTF</div>
            <div>
              Số ĐKKD: 01078338978, Sở KHĐT Tp. Hà Nội cấp ngày 25/02/2020
            </div>
            <div>Địa chỉ: 63 đường An Trai, Vân Canh, Hoài Đức, Hà Nội</div>
          </div>
        </div>
        <div className="flex flex-col gap-5 max-w-[500px]">
          <div className="text-xl font-bold">Liên hệ</div>
          <div className="flex flex-col gap-2 text-base">
            <span className="flex gap-1">
              Chăm sóc khách hàng:
              <a
                className="hover:underline hover:text-blue-500"
                href="tel:0848035003"
              >
                0855338978
              </a>
            </span>
            <span className="flex gap-1">
              Mua hàng online:
              <a
                className="hover:underline hover:text-blue-500"
                href="tel:0848035003"
              >
                0848035003
              </a>
            </span>
            <span className="flex gap-1">
              Email:
              <a
                className="hover:underline hover:text-blue-500"
                href="mailto:f5fashioncskh@gmail.com"
              >
                f5fashioncskh@gmail.com
              </a>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-5 max-w-[500px]">
          <div className="text-xl font-bold">Thông tin</div>
          <div className="flex flex-col gap-2 text-base">
            <span>Giới thiệu</span>
            <span>Hệ thống showroom</span>
            <span>Chính sách giao nhận - Vận chuyển</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footers;
