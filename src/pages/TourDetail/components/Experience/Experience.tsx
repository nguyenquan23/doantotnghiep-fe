import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Divider from '@mui/material/Divider'

interface ExperienceProps {
  experiences: { title: string; content: string }[]
}

export default function Experience(props: ExperienceProps) {
  const { experiences } = props
  return (
    <>
      <div className='text-[18px] font-semibold md:text-2xl'>Experience</div>
      <div className='flex flex-col md:gap-2'>
        {experiences.map((item, index) => (
          <div key={index}>
            <Accordion sx={{ boxShadow: 'none', border: 'none' }} defaultExpanded={false}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div className='text-[15px] font-semibold'>{item.title}</div>
              </AccordionSummary>
              <AccordionDetails>
                <div className='text-sm md:text-[16px]'>{item.content}</div>
              </AccordionDetails>
            </Accordion>
            <Divider />
          </div>
        ))}
      </div>
    </>
  )
}
