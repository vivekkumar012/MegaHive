// ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productsSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProducts, loading, error, similarProducts } = useSelector(
    (state) => state.products,
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImg, setMainImg] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProducts?.images?.length > 0) {
      setMainImg(selectedProducts.images[0].url);
    }
  }, [selectedProducts]);

  const handleQuantityChange = (action) => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    }
    if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", {
        duration: 1000,
      });
      return;
    }

    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      }),
    )
      .then(() => {
        toast.success("Product added to cart!", {
          duration: 1000,
        });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  // Show loading state
  if (loading && !selectedProducts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => dispatch(fetchProductDetails(productFetchId))}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!loading && !selectedProducts) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {selectedProducts && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Left Thumbnail View - Desktop */}
            {selectedProducts.images && selectedProducts.images.length > 0 && (
              <div className="hidden md:flex flex-col space-y-4 mr-6">
                {selectedProducts.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImg === image.url ? "border-black" : "border-gray-300"
                    }`}
                    onClick={() => setMainImg(image.url)}
                  />
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                {mainImg && (
                  <img
                    src={mainImg}
                    alt="Main Product"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
              </div>
            </div>

            {/* Mobile Thumbnail View */}
            {selectedProducts.images && selectedProducts.images.length > 0 && (
              <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
                {selectedProducts.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.altText || `Thumbnail ${index}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border flex-shrink-0 ${
                      mainImg === image.url ? "border-black" : "border-gray-300"
                    }`}
                    onClick={() => setMainImg(image.url)}
                  />
                ))}
              </div>
            )}

            {/* Right Section - Product Info */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProducts.name}
              </h1>

              {/* Price Display */}
              {selectedProducts.discountPrice &&
              selectedProducts.discountPrice < selectedProducts.price ? (
                <>
                  <p className="text-lg text-gray-600 mb-1 line-through">
                    ${selectedProducts.price}
                  </p>
                  <p className="text-xl text-gray-900 font-semibold mb-2">
                    ${selectedProducts.discountPrice}
                  </p>
                </>
              ) : (
                <p className="text-xl text-gray-900 font-semibold mb-2">
                  ${selectedProducts.price}
                </p>
              )}

              <p className="text-gray-600 mb-4">
                {selectedProducts.description}
              </p>

              {/* Color Selection */}
              {selectedProducts.colors &&
                selectedProducts.colors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-700 font-medium mb-2">Color:</p>
                    <div className="flex gap-2 mt-2">
                      {selectedProducts.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`w-10 h-10 rounded-full border-2 ${
                            selectedColor === color
                              ? "border-4 border-black"
                              : "border-gray-300"
                          }`}
                          style={{
                            backgroundColor: color.toLowerCase(),
                          }}
                          title={color}
                        ></button>
                      ))}
                    </div>
                    {selectedColor && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: {selectedColor}
                      </p>
                    )}
                  </div>
                )}

              {/* Size Selection */}
              {selectedProducts.sizes && selectedProducts.sizes.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-700 font-medium mb-2">Size:</p>
                  <div className="flex gap-2 mt-2">
                    {selectedProducts.sizes.map((size) => (
                      <button
                        onClick={() => setSelectedSize(size)}
                        key={size}
                        className={`px-4 py-2 rounded border transition-colors ${
                          selectedSize === size
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-300 hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-gray-700 font-medium mb-2">Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="px-4 py-2 bg-gray-200 rounded text-lg hover:bg-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-4 py-2 bg-gray-200 rounded text-lg hover:bg-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
                className={`bg-black text-white py-3 px-6 rounded w-full mb-4 font-medium transition-all ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-900 active:scale-95"
                }`}
              >
                {isButtonDisabled ? "Adding..." : "ADD TO CART"}
              </button>

              {/* Product Characteristics */}
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    {selectedProducts.brand && (
                      <tr className="border-b">
                        <td className="py-2 font-medium">Brand</td>
                        <td className="py-2">{selectedProducts.brand}</td>
                      </tr>
                    )}
                    {selectedProducts.material && (
                      <tr className="border-b">
                        <td className="py-2 font-medium">Material</td>
                        <td className="py-2">{selectedProducts.material}</td>
                      </tr>
                    )}
                    {selectedProducts.category && (
                      <tr className="border-b">
                        <td className="py-2 font-medium">Category</td>
                        <td className="py-2">{selectedProducts.category}</td>
                      </tr>
                    )}
                    {selectedProducts.gender && (
                      <tr className="border-b">
                        <td className="py-2 font-medium">Gender</td>
                        <td className="py-2">{selectedProducts.gender}</td>
                      </tr>
                    )}
                    {selectedProducts.sku && (
                      <tr className="border-b">
                        <td className="py-2 font-medium">SKU</td>
                        <td className="py-2">{selectedProducts.sku}</td>
                      </tr>
                    )}
                    {selectedProducts.countInStock !== undefined && (
                      <tr>
                        <td className="py-2 font-medium">Stock</td>
                        <td className="py-2">
                          {selectedProducts.countInStock > 0
                            ? `${selectedProducts.countInStock} items available`
                            : "Out of stock"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Similar Products Section */}
          {similarProducts && similarProducts.length > 0 && (
            <div className="mt-20">
              <h2 className="text-2xl text-center font-semibold mb-8">
                You May Also Like
              </h2>
              <ProductGrid
                products={similarProducts}
                loading={false}
                error={null}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
