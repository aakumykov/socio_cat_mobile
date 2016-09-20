class Item < ActiveRecord::Base
	validates :title, presence: true
	validates :content, presence: true

	has_attached_file(
		:avatar, 
		styles: { medium: "300x300>", thumb: "80x80>" }, 
		default_style: :medium,
		default_url: 'missing_image.png',
		use_timestamp: false,
		path: 'public/images/:style/:hash.:extension',
    	url: '/images/:style/:hash.:extension',
    	hash_secret: 'really-long-random-generated-string-not-publicly-accessible',
	)
	validates_attachment(:avatar,
		# 	presence: {message:'не может быть пустым'},
			content_type: { content_type: /\Aimage\/.*\Z/ },
			size: { in: 1..1024**2 },
		# 	#if: "'картинка'==self.kind"
	)
end