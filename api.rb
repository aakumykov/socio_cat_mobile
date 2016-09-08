require_relative 'model'

class API < Grape::API
	format :json

	helpers do
		def result_msg arg
			{ message: {
				type: arg.keys.first,
				text: arg.values.first,
			}}
		end
	end

	resource '/items' do

		# список
		get '/' do
			Item.all
		end

		# просмотр
		get '/:id' do
			item = Item.find_by(id: params.id)
			{ item: item.title }
		end

		# создание
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
			if item then
				result_msg success: "создана карточка #{item.id}"
			else
				result_msg error: "ошибка создания карточки"
			end
		end

		# правка
		get '/:id/edit' do
			item = Item.find_by(id: params.id)
			{ edit: item[:title] }
		end

		# обновление
		patch '/:id' do
			item = Item.find_by(id: params.id)
			item.update!( declared(params) )
			{ update: item[:id] }
		end

		# удаление
		delete '/:id' do
			item = Item.find_by(id: params.id)
			if (item) then
				if ( item.destroy ) then
					result_msg success: "карточка #{params.id} удалена"
				else
					result_msg error: "ошибка удаления карточки #{params.id}"
				end
			else
				result_msg error: "карточки #{params.id} не существует"
			end
		end
	end
end
