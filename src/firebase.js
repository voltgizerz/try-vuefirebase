import firebase from 'firebase/app';
import 'firebase/database';

export const db = firebase
  .initializeApp({ databaseURL: 'https://vueandfirebase-1b22f.firebaseio.com' })
  .database();

export const dessertsRef = db.ref('desserts');
