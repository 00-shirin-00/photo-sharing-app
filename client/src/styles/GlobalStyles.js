import { createGlobalStyle } from "styled-components";

// ==================================================

const GlobalStyles = createGlobalStyle`
    * ,
    *::before,
    *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
        body {
        width: 100%;
        height: 100vh;
        // padding: 50px;
        font-family: 'Poppins', sans-serif;
        background-color:rgb(41, 87, 81);
        color: #fff;
        border: 1px solid #fff;
        line-height: 1.6;
}
        a{
        text-decoration: none;
        color: inherit;}
        
        ul{
        list-style: none;
}
        button{
        cursor: pointer;
        background: none;
        border: none;}

        input, button, textarea, select {
        font:inherit;}
        `;
export default GlobalStyles;
