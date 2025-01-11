import * as yup from 'yup'

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Confirm password is required')
    .min(6, 'Confirm password length from 6 - 160 characters')
    .max(160, 'Confirm password length from 6 - 160 characters')
    .oneOf([yup.ref(refString)], 'Confirm password is not match')
}

export const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email')
    .min(5, 'Email length from 5 - 160 characters')
    .max(160, 'Email length from 5 - 160 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password length from 6 - 160 characters')
    .max(160, 'Password length from 6 - 160 characters'),
  confirmPassword: handleConfirmPasswordYup('password')
})

export const userSchema = yup.object({
  fullName: yup.string().trim().max(100, 'Maximum length is 100 characters').nullable(),
  phone: yup.string().trim().max(20, 'Maximum length is 20 characters').nullable(),
  address: yup.string().trim().max(160, 'Maximum length is 160 characters').nullable(),
  dateOfBirth: yup.date().nullable(),
  password: schema.fields['password'],
  newPassword: yup
    .string()
    .required('New password is required')
    .min(6, 'New password length from 6 - 160 characters')
    .max(160, 'New password length from 6 - 160 characters'),
  confirmPassword: handleConfirmPasswordYup('newPassword')
})

export const guideApplicationSchema = userSchema.shape({
  fullName: yup
    .string()
    .trim()
    .required('Full name is required')
    .max(100, 'Maximum length of full name is 100 characters'),
  phone: yup.string().trim().max(20, 'Maximum length is 20 characters').required('Phone is required'),
  address: yup.string().trim().required('Address is required').max(160, 'Maximum length is 160 characters'),
  dateOfBirth: yup.date().required('Date of birth is required').typeError('Date of birth must be a date'),
  email: yup.string().email('Email is invalid').required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password length from 6 - 160 characters')
    .max(160, 'Password length from 6 - 160 characters'),
  yearsOfExperience: yup
    .number()
    .required('Year of experience is required')
    .min(0, 'Year of experience must be greater than or equal to 0')
    .typeError('Year of experience must greater than or equal to 0'),
  isLicensedGuide: yup.boolean().required(),
  licenseImages: yup.array().of(yup.string()),
  transportation: yup.object().required(),
  biography: yup.string().required('Biography is required').max(600, 'Maximum length is 600 characters')
})

export const tourSchema = yup.object({
  name: yup.string().trim().required('Name is required').max(100, 'Maximum length is 100 characters'),
  description: yup.string().trim(),
  transportation: yup.string().trim().required('Transportation is required'),
  includeService: yup.string().trim(),
  duration: yup
    .number()
    .positive('Duration must be a positive number')
    .required('Duration is required')
    .typeError('Duration must be positive a number'),
  unit: yup.string().trim().required('Unit is required'),
  estimatedLocalCashNeeded: yup
    .string()
    .required('Estimated local cash needed is required')
    .typeError('Estimated local cash needed is required'),
  pricePerTraveler: yup
    .number()
    .positive('Price per traveler must be a positive number')
    .required('Price per traveler is required')
    .typeError('Price per traveler must be positive a number'),
  limitTraveler: yup
    .number()
    .positive('Limit traveler must be a positive number')
    .required('Limit traveler is required')
    .typeError('Limit traveler must be positive a number'),
  itinerary: yup.string().trim().required('Itinerary is required'),
  locations: yup
    .array()
    .test('atLeastOne', 'Locations must have at least 1 confirmed location & be saved', function (value) {
      return value && value.length >= 1
    })
    .required('Locations must have at least 1 confirmed location & be saved'),
  categories: yup.array().of(
    yup.object().shape({
      id: yup.number(),
      name: yup.string()
    })
  ),
  images: yup.array(),
  startTimes: yup.array().required('Start times is required')
})

export const searchSchema = yup.object({
  searchValue: yup.string().trim().required(),
  searchType: yup.string().required()
})

export const bookingSchema = yup.object({
  startDate: yup.date().required('Start date is required').typeError('Start date must be a date'),
  numberTravelers: yup.number().positive().required().typeError('Number of travelers must be positive a number'),
  startTime: yup.string().required()
})

export const requestTourSchema = yup.object({
  transportation: yup.array().min(1, 'At least one transportation option must be selected'),
  duration: yup
    .number()
    .positive('Duration must be a positive number')
    .required('Duration is required')
    .typeError('Duration must be positive a number'),
  unit: yup.string().trim().required('Unit is required'),
  maxPricePerPerson: yup
    .number()
    .positive('Max price per traveler must be a positive number')
    .required('Max price per traveler is required')
    .typeError('Max price per traveler must be a positive number'),
  numberOfTravelers: yup.number().positive("Number of traveler must be a positive number").required("Number of traveler is required").typeError('Number of travelers must be a positive number'),
  destination: yup.string().required('Destination is required'),
  message: yup.string(),
  phone: yup.string().trim().required('Phone is required').typeError('Phone is required'),

})

export const commentSchema = yup.object({
  comment: yup.string().trim().required('Comment is required'),
  rating: yup.number().required('Rating is require').min(1).max(5)
})

export const passengerInformationSchema = yup.object({
  fullName: yup.string().trim().required('Full name is required'),
  phone: yup.string().trim().required('Phone is required').typeError('Phone is required'),
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email')
    .min(5, 'Email length from 5 - 160 characters')
    .max(160, 'Email length from 5 - 160 characters')
})

export type Schema = yup.InferType<typeof schema>

export type UserSchema = yup.InferType<typeof userSchema>

export type TourSchema = yup.InferType<typeof tourSchema>

export type GuideApplicationSchema = yup.InferType<typeof guideApplicationSchema>

export type SearchSchema = yup.InferType<typeof searchSchema>

export type BookingSchema = yup.InferType<typeof bookingSchema>

export type RequestTourSchema = yup.InferType<typeof requestTourSchema>

export type CommentSchema = yup.InferType<typeof commentSchema>

export type PassengerInformationSchema = yup.InferType<typeof passengerInformationSchema>
