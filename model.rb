class Item < ActiveRecord::Base
	include Paperclip::Glue

	validates :title, presence: true
	validates :content, presence: true

	has_attached_file(
		:avatar, 
		styles: { preview: "300x300>", thumbnail: "80x80>" }, 
		default_style: :medium,
		use_timestamp: false,
		default_url: '/missing_image.png',
		path: 'public/:url',
    	url: '/images/:style/:hash.:extension',
    	hash_secret: 'really-long-random-generated-string-not-publicly-accessible',
	)
	validates_attachment(:avatar,
		# 	presence: {message:'не может быть пустым'},
			content_type: { content_type: /\Aimage\/.*\Z/ },
			size: { 
				in: 1..1024**2,
				message: 'превышен допустимый размер изображения'
			},
		# 	#if: "'картинка'==self.kind"
	)
end