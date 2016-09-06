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


		params do
			requires :card_title, type: String
			requires :card_content, type: String
		end
		post '/new' do
			par = declared(params)
			item = Item.create!(
				title: par[:card_title],
				content: par[:card_content],
			)
			{ message: "item id=#{item.id}" }
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


		delete '/:id' do
			#item = Item.find_by(id: params.id)
			#item.destroy!
			{ delete: params[:id] }
		end
	end
end
