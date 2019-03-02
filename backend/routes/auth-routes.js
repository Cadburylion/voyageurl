import passport from 'passport';
import { embeddHtmlWithJWT } from '../util';
const router = require('express').Router();

// auth with google
router.get(
  '/google',
  passport.authenticate('google-auth', {
    scope: ['profile'],
  })
);

// callback route for google to redirect to
router.get(
  '/google/redirect',
  passport.authenticate('google-auth', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    const htmlWithEmbeddedJWT = embeddHtmlWithJWT(req);
    res.send(htmlWithEmbeddedJWT);
  }
);

// auth with facebook
router.get('/facebook', passport.authenticate('facebook-auth'));

router.get(
  '/facebook/redirect',
  passport.authenticate('facebook-auth', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    const htmlWithEmbeddedJWT = embeddHtmlWithJWT(req);
    res.send(htmlWithEmbeddedJWT);
  }
);

// auth with github
router.get('/github', passport.authenticate('github-auth'));

router.get(
  '/github/redirect',
  passport.authenticate('github-auth', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    const htmlWithEmbeddedJWT = embeddHtmlWithJWT(req);
    res.send(htmlWithEmbeddedJWT);
  }
);

// auth with twitter
router.get('/twitter', passport.authenticate('twitter-auth'));

router.get(
  '/twitter/redirect',
  passport.authenticate('twitter-auth', {
    failureRedirect: '/',
    session: false,
  }),
  (req, res) => {
    const htmlWithEmbeddedJWT = embeddHtmlWithJWT(req);
    res.send(htmlWithEmbeddedJWT);
  }
);

module.exports = router;
