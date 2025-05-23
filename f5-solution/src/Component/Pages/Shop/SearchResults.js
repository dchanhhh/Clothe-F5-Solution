import React from "react";
import { useNavigate } from "react-router-dom";

const SearchResults = ({ products, visible }) => {
  const navigate = useNavigate();

  const handleViewMore = (id) => {
    navigate(`/Products/${id}`);
  };

  if (!visible) return null;

  if (!products || products.length === 0) {
    return (
      <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg z-50 border border-gray-200">
        <div className="flex flex-col justify-center items-center py-4">
          <img
            src="https://static.vecteezy.com/system/resources/previews/006/208/684/non_2x/search-no-result-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
            width={150}
          />
          <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-lg z-50 border border-gray-200 max-h-80 overflow-y-auto">
      <div className="p-2">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center gap-4 p-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            onClick={() => handleViewMore(product.id)}
          >
            <img
              alt={product.tenSp}
              src={product.imageDefaul}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex flex-col flex-1">
              <span className="text-sm font-medium">{product.tenSp}</span>
              <span className="text-sm font-bold text-primary">
                {`${product.giaBan.toLocaleString()} VNĐ`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
