import { useState, useEffect } from "react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [usPsArray, setUsPsArray] = useState([]);
  const [usFound, setUsFound] = useState(false);

  function handleUsernameChange(event) {
    setUsername(event.target.value);
    let user = usPsArray.find(
      (person) => person.username === event.target.value
    );
    if (user) {
      setUsFound(true);
    } else {
      setUsFound(false);
    }
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/data.json");
        if (response.ok) {
          const responseBody = await response.text();
          if (responseBody) {
            let us_ps_array = JSON.parse(responseBody);
            setUsPsArray(us_ps_array.people);
          }
        }
      } catch (error) {
        setErrorMessage("Error occurred while fetching data");
      }
    }
    fetchData();
  }, []);

  async function handleFormSubmit(event) {
    event.preventDefault();
    const form = document.querySelector("form");
    form.classList.add("was-validated");
    try {
      if (usPsArray.length === 0) {
        throw new Error("Data not available");
      } else {
        let user = usPsArray.find((person) => person.username === username);
        if (user) {
          if (user.password === password) {
            setUsername("");
            setPassword("");
            alert("login successful");
          } else {
            throw new Error("Incorrect password");
          }
        } else {
          throw new Error("User not found");
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  }
  return (
    <div class="form_container">
      <h1>Login</h1>
      {errorMessage && <div>{errorMessage}</div>}
      <form onSubmit={handleFormSubmit} noValidate>
        <div class="form-floating ">
          <input
            type="text"
            className="form-control"
            placeholder="username"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
          <label htmlFor="username">Username:</label>
        </div>
        {usFound ? <div>User found</div> : <div>User not found</div>}
        <div class="form-floating mt-3">
          <input
            type="password"
            className="form-control"
            placeholder="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          <label htmlFor="password">Password:</label>
        </div>
        <div></div>
        <button className="btn btn-primary mt-3" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
