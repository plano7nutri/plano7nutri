"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Phone, Calendar, User } from "lucide-react";

interface AdminUserListProps {
  users: any[];
  type: 'pago' | 'gratis' | 'lead';
}

const AdminUserList = ({ users, type }: AdminUserListProps) => {
  const navigate = useNavigate();

  const handleViewDashboard = (user: any) => {
    if (type === 'pago') {
      navigate('/dashboardpago', { state: { adminViewData: user } });
    } else {
      navigate('/dashboard', { state: user });
    }
  };

  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12 bg-zinc-50 rounded-2xl border-2 border-dashed border-zinc-200">
        <User className="mx-auto text-zinc-300 mb-3" size={40} />
        <p className="text-zinc-500 font-medium">Nenhum usuário encontrado nesta categoria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-zinc-50">
          <TableRow>
            <TableHead className="font-bold">Nome</TableHead>
            <TableHead className="font-bold">WhatsApp</TableHead>
            <TableHead className="font-bold">Data</TableHead>
            {type === 'pago' && <TableHead className="font-bold">Plano</TableHead>}
            {type !== 'lead' && <TableHead className="text-right font-bold">Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="hover:bg-zinc-50/50 transition-colors">
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span className="text-zinc-950">{user.nome || user.nome_usuario || "Sem nome"}</span>
                  {user.email && <span className="text-[10px] text-zinc-400">{user.email}</span>}
                </div>
              </TableCell>
              <TableCell>
                <a 
                  href={`https://wa.me/${user.whatsapp || user.telefone_cadastro}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-600 hover:underline font-medium"
                >
                  <Phone size={14} />
                  {user.whatsapp || user.telefone_cadastro}
                </a>
              </TableCell>
              <TableCell className="text-zinc-500 text-xs">
                <div className="flex items-center gap-1.5">
                  <Calendar size={12} />
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </div>
              </TableCell>
              {type === 'pago' && (
                <TableCell>
                  <Badge variant={user.assinatura_ativa ? "default" : "destructive"} className="text-[10px] uppercase">
                    {user.tipo_assinatura || "Única"}
                  </Badge>
                </TableCell>
              )}
              {type !== 'lead' && (
                <TableCell className="text-right">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleViewDashboard(user)}
                    className="gap-2 text-xs font-bold border-primary/20 text-primary hover:bg-primary/5"
                  >
                    <Eye size={14} />
                    Ver Dash
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminUserList;