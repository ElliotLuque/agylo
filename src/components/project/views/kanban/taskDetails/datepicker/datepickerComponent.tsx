import { useState } from 'react'
import { type Calendar, useDatePicker } from '@rehookify/datepicker'

const DatepickerComponent: React.FC = () => {
	const [selectedDates, onDatesChange] = useState<Date[]>([])
	const {
		data: { weekDays, calendars },
		propGetters: { dayButton, previousMonthButton, nextMonthButton },
	} = useDatePicker({
		selectedDates,
		onDatesChange,
	})

	// calendars[0] is always present, this is an initial calendar
	const { year, month, days } = calendars[0] as Calendar

	const onDayClick = (evt: any, date: Date) => {
		// In case you need any action with evt
		evt.stopPropagation()

		// In case you need any additional action with date
		console.log(date)
	}

	// selectedDates is an array of dates
	// formatted with date.toLocaleDateString(locale, options)
	return (
		<div className='absolute z-30 origin-top-right divide-y divide-gray-100'>
			<section className=' mt-2 w-72 rounded-md bg-white p-3 shadow-lg ring-1 ring-black/5 focus:outline-none'>
				<header className='flex flex-col items-center'>
					<div className='mb-3 flex w-full items-center justify-between gap-2'>
						<button {...previousMonthButton()}>&lt;</button>
						<p>
							{month} {year}
						</p>
						<button {...nextMonthButton()}>&gt;</button>
					</div>
					<ul className='flex flex-wrap items-center gap-3'>
						{weekDays.map((day) => (
							<li key={`${month}-${day}`}>{day}</li>
						))}
					</ul>
				</header>
				<ul className='flex flex-wrap items-center gap-3'>
					{days.map((dpDay) => (
						<li key={`${month}-${dpDay.day}`}>
							<button {...dayButton(dpDay, { onClick: onDayClick })}>
								{dpDay.day}
							</button>
						</li>
					))}
				</ul>
			</section>
		</div>
	)
}

export default DatepickerComponent
