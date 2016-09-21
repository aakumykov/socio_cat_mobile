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
			{
				title: item.title,
				content: item.content,
				avatar: {
					preview: item.avatar(:medium),
					orig: item.avatar(:original),
				}
			}
		end

		# создание
		params do
			requires :title, type: String
			requires :content, type: String
			optional :avatar, default: false
		end
		post '/new' do
			require 'awesome_print'
			puts '------------ params -------------'
			ap params
			puts '------------ params -------------'

			puts '------------ declared(params) -------------'
			ap declared(params)
			puts '------------ declared(params) -------------'

			par = declared(params)
			
			data = {
				title: par.title,
				content: par.content,
			}
			data[:avatar] = par.avatar.tempfile if par.avatar # != false

			item = Item.create(data)
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
		params do
			requires :title, type: String
			requires :content, type: String
		end
		patch '/:id' do
			par = declared(params)
			par = {
				title: par.title,
				content: par.content,
			}
			item = Item.find_by(id: params.id).update(par)
			if item then
				result_msg success: "изменена карточка #{params.id}"
			else
				result_msg error: "ошибка изменения карточки #{params.id}"
			end
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
