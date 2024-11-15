import axios from 'axios';
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';

// Resolves issues with 'Error: Cross origin http://localhost forbidden'
axios.defaults.adapter = require('axios/lib/adapters/http');
