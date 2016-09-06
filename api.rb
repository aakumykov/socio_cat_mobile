require_relative 'model'

class API < Grape::API
	format :json

	resource '/items' do

		get '/' do
			Item.all
		end

		get '/:id' do
			item = Item.find_by(id: params.id)
			{ item: item.title }
		end

		post '/new' do
			item = Item.create!( declared(params) )
			{ new_item: item[:id] }
		end

		get '/:id/edit' do
			item = Item.find_by(id: params.id)
			{ edit: item[:title] }
		end

		patch '/:id' do
			item = Item.find_by(id: params.id)
			item.update!( declared(params) )
			{ update: item[:id] }
		end

		delete ':id/delete' do
			item = Item.find_by(id: params.id)
			item.destroy!
			{ deleted_item: item.id }
		end
	end
end
