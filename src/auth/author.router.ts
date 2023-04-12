import Router from 'express'
import { getAuthorController, getAuthorsController, signinController, signupController, updateAuthorController } from './author.controller'

export const router = Router()


/** create signle author account */
router.post('/sign-up/', signupController)


/** update  single author account */
router.put('/:author_id/', updateAuthorController)


/* login to author by usernam or email and password and generate toke for author */
router.post('/sign-in/', signinController)


/** get all author */
router.get('', getAuthorsController)


/** get single author by his id */
router.get('/:author_id/', getAuthorController)