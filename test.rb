require 'active_record'
require 'faker'
ActiveRecord::Base.establish_connection(adapter:'sqlite3', database: 'db/data.sqlite3')
class Item < ActiveRecord::Base
	validates :title, presence: true
	validates :content, presence: true
end