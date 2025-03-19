import { useState } from "react";
import { useEffect } from "react";

import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "",
    price: "",
  });
  const [productsToDisplay, setProductsToDisplay] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3030/products");
        const data = await res.json();
        if (data.Error) {
          throw new Error(data.Error);
        }
        setProducts(data.data.products);
        setProductsToDisplay(data.data.products);
      } catch (Error) {
        setError(Error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  function handleInput(event) {
    setSearchInput(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!searchInput) return;
    try {
      const res = await fetch(
        `http://localhost:3030/search?searchQuery=${searchInput}`
      );
      const data = await res.json();
      setProducts(data.data.products);
    } catch (error) {
      console.log(error);
    }
    setSearchInput("");
  };

  function handleFormInput(event) {
    const { name, value } = event.target;
    setNewProduct({
      ...newProduct,
      [name]: value,
    });
  }
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await fetch("http://localhost:3030/addProduct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      const data = await res.json();
      setProducts([data.data, ...products]);
    } catch (error) {
      console.log(error);
    }
    setNewProduct({ title: "", category: "", price: "" });
  };

  function sortProducts(event) {
    if (event.target.value === "name") {
      const sortedProducts = [...productsToDisplay].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      setProductsToDisplay(sortedProducts);
    } else if (event.target.value === "price") {
      const sortedProducts = [...productsToDisplay].sort(
        (a, b) => a.price - b.price
      );
      setProductsToDisplay(sortedProducts);
    } else {
      console.log("no sorted needed");

      setProductsToDisplay(products);
    }
  }

  function filterProducts(event) {
    if (event.target.value === "beauty") {
      setProductsToDisplay(productsToDisplay.filter((item) => item.category === 'beauty'))
    }
  }

  console.log("products:", products);
  console.log(newProduct);

  return (
    <div className="container">
      <header style={{ border: "2px solid red" }}>
        <div className="search-bar-wrapper">
          <input
            className="search-bar"
            type="text"
            placeholder="Search products..."
            value={searchInput || ""}
            onChange={handleInput}
          ></input>
          <button
            type="button"
            className="search-button"
            onClick={handleSubmit}
          >
            Search
          </button>
        </div>
      </header>
      <aside style={{ border: "2px solid green" }}>
        <div>
          <div>
            <label htmlFor="sort">Sort By: </label>
            <select name="sort" id="sort" onChange={sortProducts}>
              <option value="default">Select Type</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>
          <label htmlFor="filter">Filter: </label>
          <div>
            <select name="filter" id="filter" onChange={filterProducts}>
              <option value="default">Select Type</option>
              <option value="beauty">Beauty</option>
              <option value="fragrances">Frangrances</option>
            </select>
          </div>
        </div>

        <form className="product-form" onSubmit={handleFormSubmit}>
          Product Form
          <input
            type="text"
            name="title"
            placeholder="title"
            value={newProduct.title}
            onChange={handleFormInput}
          ></input>
          <input
            type="text"
            name="category"
            placeholder="category"
            value={newProduct.category}
            onChange={handleFormInput}
          ></input>
          <input
            type="text"
            name="price"
            placeholder="price"
            value={newProduct.price}
            onChange={handleFormInput}
          ></input>
          <button type="submit">Add New Product</button>
        </form>
      </aside>
      <main style={{ border: "2px solid lightblue" }}>
        {isLoading && <div>Loading...</div>}
        {error && <div>{error}</div>}

        <ul className="product-list">
          {productsToDisplay.map((product) => (
            <li key={product.id}>
              <div
                className="product-image"
                style={{ border: "1px solid black" }}
              >
                <img src={product.thumbnail} alt={`${product.title} image`} />
              </div>
              <div>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>{product.category}</p>
                <p>Price: £{product.price}</p>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default App;
