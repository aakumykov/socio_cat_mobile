require_relative 'model'

task :default => :migrate

namespace :db do
	desc "Run migrations"
	
	task :migrate do
	  ActiveRecord::Migrator.migrate('db/migrate', ENV["VERSION"] ? ENV["VERSION"].to_i : nil)
	end

	task :populate do
		3.times do
			item = Item.new
			item.title = Faker::Lorem.word.capitalize
			item.content = Faker::Lorem.paragraph
			item.save
		end
	end
end