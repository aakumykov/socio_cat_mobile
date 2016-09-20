require 'active_record'
require 'paperclip'
require 'faker'

ActiveRecord::Base.establish_connection(adapter:'sqlite3', database: 'db/data.sqlite3')

class Item < ActiveRecord::Base
	include Paperclip::Glue

	validates :title, presence: true
	validates :content, presence: true

	has_attached_file(
		:avatar, 
		path: 'public/images/:style/:filename',
		styles: { medium: "300x300>", thumb: "100x100>" }, 
		default_style: :medium,
		default_url: 'missing_image.png',
		use_timestamp: true,
	)	
	validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/
end