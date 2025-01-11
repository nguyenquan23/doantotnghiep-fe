import { useState, Dispatch, SetStateAction } from 'react'

export const useToggle = (defaultValue: boolean): [boolean, () => void, Dispatch<SetStateAction<boolean>>] => {
  const [value, setValue] = useState<boolean>(defaultValue)
  const toggle = () => setValue((prev) => !prev)

  return [value, toggle, setValue]
}
