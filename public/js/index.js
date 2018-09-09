const socket = io()

socket.on('connect', () => {
  console.log('Connected to server')
})

socket.on('disconnect', () => {
  console.log('Disconnected from server')
})

socket.on('newMessage', message => {
  // console.log('New message', message)
  const li = jQuery('<li></li>')

  li.text(`${message.from}: ${message.text}`)
  jQuery('#messages').append(li)
})

socket.on('newLocationMessage', message => {
  const li = jQuery('<li></li>')
  const a = jQuery('<a target="_blank">My current location</a>')

  li.text(`${message.from}: `)
  a.attr('href', message.url)
  li.append(a)
  jQuery('#messages').append(li)
})

jQuery('#message-form').on('submit', e => {
  e.preventDefault()

  const messageTextbox = jQuery('[name=message]')

  socket.emit(
    'createMessage',
    {
      from: 'User',
      text: messageTextbox.val(),
    },
    () => {
      messageTextbox.val('')
    },
  )
})

const locationButton = jQuery('#send-location')
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.')
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...')

  navigator.geolocation.getCurrentPosition(
    position => {
      locationButton.removeAttr('disabled').text('Send location')
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    },
    () => {
      locationButton.removeAttr('disabled').text('Send location')
      alert('Unable to fetch location.')
    },
  )
})
