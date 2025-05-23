import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import HomeView from "../../../Service/HomeService";
import HeaderF5 from "../../Layouts/Header/Header";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

const f5Blogs = [
  {
    fid: 1,
    title: "F5 Blog 1",
    imgSrc:
      "https://file.hstatic.net/200000182297/article/342544079_185591394364106_3474506149512152400_n__1__7b5ebc8e82e84130a3effdf0c7599fa1_large.jpg",
  },
  {
    fid: 2,
    title: "F5 Blog 2",
    imgSrc:
      "https://file.hstatic.net/200000182297/article/327890757_8735259056545354_6482098786089923519_n_ee711d5e3b9f4541b8c10fed967c16ca_large.jpg",
  },
  {
    fid: 3,
    title: "F5 Blog 3",
    imgSrc:
      "https://file.hstatic.net/200000182297/article/315854475_2623148267823058_3203710229884569157_n_3baa02b3ee4348339faec98be869be0d_large.jpg",
  },
  {
    fid: 4,
    title: "F5 Blog 4",
    imgSrc:
      "https://file.hstatic.net/200000182297/article/285634743_2457803104357576_4449744498852558662_n_a415bf75ede64fc997cbc67f348f8153_large.jpg",
  },
];

const ProductSkeleton = () => (
  <div className="product-card relative flex flex-col bg-white rounded-xl">
    <div className="w-full h-[420px] bg-gray-200 animate-pulse rounded-t-lg"></div>
    <div className="flex flex-col h-[80px] gap-2 p-3 items-center justify-center w-full">
      <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
      <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
    </div>
  </div>
);

const SkeletonSlider = () => (
  <div className="grid grid-cols-5 gap-4">
    {[1, 2, 3, 4, 5].map((index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [TaiKhoan, setUsername] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(user.TaiKhoan);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchNewProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await HomeView.ViewProductHome();
        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message || "Không thể tải danh sách sản phẩm.");
          console.error("Error fetching products:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchNewProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const listDamProducts = products.filter(
    (product) => product.danhMuc?.tenDanhMuc === "Đầm"
  );

  const listAoProducts = products.filter(
    (product) =>
      product.danhMuc?.tenDanhMuc === "Áo sơ mi" ||
      product.danhMuc?.tenDanhMuc === "Áo phông"
  );

  const handleViewMore = (id) => {
    navigate(`/Products/${id}`);
  };

  return (
    <>
      <HeaderF5 products={products} />
      <div className="flex flex-col gap-6 px-6 pt-6 pb-20 bg-[#f5f5f5]">
        <Swiper
          className="mySwiper rounded-xl"
          pagination={{
            clickable: true,
          }}
          navigation={true}
          loop={true}
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://theme.hstatic.net/200000182297/1000887316/14/ms_banner_img1_master.jpg?v=1633"
              alt="Banner 1"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://theme.hstatic.net/200000182297/1000887316/14/ms_banner_img2_master.jpg?v=1633"
              alt="Banner 2"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://theme.hstatic.net/200000182297/1000887316/14/ms_banner_img3_master.jpg?v=1633"
              alt="Banner 3"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://theme.hstatic.net/200000182297/1000887316/14/ms_banner_img4_master.jpg?v=1633"
              alt="Banner 4"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://theme.hstatic.net/200000182297/1000887316/14/ms_banner_img2_master.jpg?v=1927"
              alt="Banner 5"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://theme.hstatic.net/200000182297/1000887316/14/hb_image1_master.jpg?v=1927"
              alt="Banner 6"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://theme.hstatic.net/200000182297/1000887316/14/hb_image2_master.jpg?v=1927"
              alt="Banner 7"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://theme.hstatic.net/200000182297/1000887316/14/ms_banner_img1_master.jpg?v=1523"
              alt="Banner 8"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://theme.hstatic.net/200000182297/1000887316/14/ms_banner_img1_master.jpg?v=1947"
              alt="Banner 9"
            />
          </SwiperSlide>
        </Swiper>

        <div className="flex flex-col gap-6">
          <span className="text-2xl text-center font-bold">SẢN PHẨM MỚI</span>
          {error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : isLoading ? (
            <SkeletonSlider />
          ) : (
            <Swiper
              className="mySwiper swiper-slide rounded-xl"
              slidesPerView={5}
              slidesPerGroup={1}
              spaceBetween={12}
              navigation={true}
              loop={products.length >= 5}
              modules={[Autoplay, Navigation]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
            >
              {products.map((product) => (
                <SwiperSlide
                  key={product.id}
                  className="product-card relative flex flex-col bg-white rounded-xl border-2 border-gray-300"
                >
                  <img
                    alt={product.tenSp}
                    src={product.imageDefaul}
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="flex flex-col gap-2 p-3 items-center border-t w-full border-t-gray-300">
                    <span className="text-sm font-bold uppercase">
                      {product.tenSp}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {`${product.giaBan.toLocaleString()} VNĐ`}
                    </span>
                  </div>
                  <div className="overlay">
                    <button
                      className="view-more-button"
                      onClick={() => handleViewMore(product.id)}
                    >
                      Xem thêm
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <Swiper
          className="mySwiper rounded-xl mt-8"
          pagination={{
            clickable: true,
          }}
          navigation={true}
          loop={true}
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://media.canifa.com/Simiconnector/BannerSlider/a/o/aogio_topbanner_desktop-12aug.webp"
              alt="Banner 1"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://2885371169.e.cdneverest.net/media/Simiconnector/BannerSlider/s/p/spmoi_topbanner_desktop-030425.webp"
              alt="Banner 2"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://2885371169.e.cdneverest.net/media/Simiconnector/BannerSlider/f/a/family_topbanner_desktop-140425.webp"
              alt="Banner 3"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://2885371169.e.cdneverest.net/media/Simiconnector/BannerSlider/c/a/canifas_topbanner_desktop-140425.webp"
              alt="Banner 4"
            />
          </SwiperSlide>
        </Swiper>

        <div className="flex flex-col gap-6">
          <span className="text-2xl text-center font-bold">
            SẢN PHẨM GIÁ TỐT
          </span>
          {error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : isLoading ? (
            <SkeletonSlider />
          ) : (
            <Swiper
              className="mySwiper swiper-slide rounded-xl"
              slidesPerView={5}
              slidesPerGroup={1}
              spaceBetween={12}
              navigation={true}
              loop={true}
              modules={[Autoplay, Navigation]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
            >
              {listDamProducts.map((product) => (
                <SwiperSlide
                  key={product.id}
                  className="product-card relative flex flex-col bg-white rounded-xl border-2 border-gray-300"
                >
                  <img
                    alt={product.tenSp}
                    src={product.imageDefaul}
                    className="w-full h-full object-cover"
                  />
                  <div className="flex flex-col gap-2 p-3 items-center border-t w-full border-t-gray-300">
                    <span className="text-sm font-bold uppercase ">
                      {product.tenSp}
                    </span>
                    <span className="text-sm font-bold text-primary">{`${product.giaBan.toLocaleString()} VNĐ`}</span>
                  </div>
                  <div className="overlay">
                    <button
                      className="view-more-button"
                      onClick={() => handleViewMore(product.id)}
                    >
                      Xem thêm
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <Swiper
          className="mySwiper rounded-xl mt-8"
          pagination={{
            clickable: true,
          }}
          navigation={true}
          loop={true}
          modules={[Autoplay, Pagination, Navigation]}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://file.hstatic.net/200000182297/file/vac_fd6422cd073b44208df1c5e9432f4043.jpg"
              alt="Banner 1"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://file.hstatic.net/200000182297/file/knik3_15d6aacb3b394d989edaf7f747634e78.jpg"
              alt="Banner 2"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://file.hstatic.net/200000182297/file/tone-sur-tone.jpg"
              alt="Banner 3"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="object-cover w-full h-full"
              src="https://file.hstatic.net/200000182297/file/banner-web-ct-sale-ec-t5-1920x500.jpg"
              alt="Banner 4"
            />
          </SwiperSlide>
        </Swiper>

        <div className="flex flex-col gap-6">
          <span className="text-2xl text-center font-bold">
            CÁC MẪU ÁO NỔI BẬT
          </span>
          {error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : isLoading ? (
            <SkeletonSlider />
          ) : (
            <Swiper
              className="mySwiper swiper-slide rounded-xl"
              slidesPerView={5}
              slidesPerGroup={1}
              spaceBetween={12}
              navigation={true}
              loop={true}
              modules={[Autoplay, Navigation]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
            >
              {listAoProducts.map((product) => (
                <SwiperSlide
                  key={product.id}
                  className="product-card relative flex flex-col bg-white rounded-xl border-2 border-gray-300"
                >
                  <img
                    alt={product.tenSp}
                    src={product.imageDefaul}
                    className="w-full h-full object-cover"
                  />
                  <div className="flex flex-col gap-2 p-3 items-center border-t w-full border-t-gray-300">
                    <span className="text-sm font-bold uppercase ">
                      {product.tenSp}
                    </span>
                    <span className="text-sm font-bold text-primary">{`${product.giaBan.toLocaleString()} VNĐ`}</span>
                  </div>
                  <div className="overlay">
                    <button
                      className="view-more-button"
                      onClick={() => handleViewMore(product.id)}
                    >
                      Xem thêm
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        <div className="flex flex-col gap-6 px-40">
          <div className="flex flex-col gap-2">
            <span className="text-2xl text-center font-bold">F5 BLOG</span>
            <span className="text-base text-center font-bold">
              ĐÓN ĐẦU XU HƯỚNG, ĐỊNH HÌNH PHONG CÁCH
            </span>
          </div>
          <Swiper
            className="mySwiper swiper-slide rounded-xl"
            slidesPerView={3}
            slidesPerGroup={1}
            spaceBetween={12}
            navigation={true}
            loop={true}
            modules={[Autoplay, Navigation]}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            {f5Blogs.map((blog) => (
              <SwiperSlide
                key={blog.wid}
                className="blog-card relative flex flex-col bg-white rounded-xl border-2 border-gray-300"
              >
                <img
                  alt={blog.title}
                  src={blog.imgSrc}
                  className="w-full h-full object-cover aspect-[5/3]"
                />
                <div className="flex flex-col gap-2 p-3 items-center border-t w-full border-t-gray-300">
                  <span className="text-sm font-bold uppercase ">
                    {blog.title}
                  </span>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      {/* Nếu có route hoặc render ProductDetail hoặc ProductPage thì truyền products={products} */}
      {/* <ProductDetail products={products} /> */}
      {/* <ProductPage products={products} /> */}
    </>
  );
};

export default Home;
