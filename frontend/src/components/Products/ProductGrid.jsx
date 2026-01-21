import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-lg text-gray-600">Loading products...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-lg text-red-600">Error: {error}</p>
      </div>
    );
  }
  
  if (!products || products.length === 0) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-lg text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product._id} className="block" to={`/product/${product._id}`}>
          <div className="bg-white p-4 rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-full h-96 mb-4 overflow-hidden rounded-lg">
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-sm font-medium mb-2 line-clamp-2">{product.name}</h3>
            <div className="flex items-center gap-2">
              {product.discountPrice && product.discountPrice < product.price ? (
                <>
                  <p className="font-medium text-sm text-gray-900">
                    ${product.discountPrice}
                  </p>
                  <p className="text-sm text-gray-500 line-through">
                    ${product.price}
                  </p>
                </>
              ) : (
                <p className="font-medium text-sm text-gray-900">
                  ${product.price}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;